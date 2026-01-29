import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2, Star, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { getFoodItems, addFoodItem, updateFoodItem, deleteFoodItem } from '../../lib/db';
import socket from '../../services/socket';

const FoodManagement = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: 'All',
        image: '',
        available: true
    });
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchItems();

        // Real-time updates
        socket.on('food-added', (newItem) => {
            setItems(prev => [newItem, ...prev]);
        });

        socket.on('food-updated', (updatedItem) => {
            setItems(prev => prev.map(item => item._id === updatedItem._id ? updatedItem : item));
        });

        socket.on('food-deleted', (deletedId) => {
            setItems(prev => prev.filter(item => item._id !== deletedId));
        });

        return () => {
            socket.off('food-added');
            socket.off('food-updated');
            socket.off('food-deleted');
        };
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const data = await getFoodItems("All Items");
            setItems(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            description: '',
            category: 'All',
            image: '',
            available: true
        });
        setImageFile(null);
        setEditingItem(null);
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                price: item.price,
                description: item.description,
                category: item.category || 'All',
                image: item.imageUrl || '',
                available: item.available
            });
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('price', formData.price);
            data.append('description', formData.description);
            data.append('category', formData.category);
            data.append('available', formData.available);

            if (imageFile) {
                data.append('image', imageFile);
            } else if (editingItem) {
                data.append('imageUrl', formData.image);
            }

            if (editingItem) {
                await updateFoodItem(editingItem._id, data);
            } else {
                await addFoodItem(data);
            }

            await fetchItems();
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error("Error saving food:", error);
            alert("Failed to save food item. Check console for details.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this dish forever? 🍔")) {
            await deleteFoodItem(id);
            fetchItems();
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Menu Manager</h1>
                    <p className="text-gray-500 font-medium">Curate your kitchen's masterpieces.</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="h-14 px-8 rounded-2xl shadow-lg shadow-primary/20">
                    <Plus size={24} className="mr-2" /> Create New Dish
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-[32px] overflow-hidden border border-gray-100 h-[400px] animate-pulse">
                            <div className="h-48 bg-gray-100" />
                            <div className="p-6 space-y-4">
                                <div className="h-6 w-3/4 bg-gray-100 rounded-full" />
                                <div className="h-4 w-full bg-gray-100 rounded-full" />
                                <div className="h-12 w-full bg-gray-100 rounded-2xl" />
                            </div>
                        </div>
                    ))
                ) : (
                    items.map(item => (
                        <div key={item._id} className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-2">
                            <div className="relative h-56 w-full overflow-hidden">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className="h-full w-full bg-gray-50 flex items-center justify-center">
                                        <ImageIcon className="text-gray-200" size={64} />
                                    </div>
                                )}
                                {!item.available && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                        <span className="text-white font-black uppercase tracking-widest text-lg">Sold Out</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-black text-gray-900 line-clamp-1">{item.name}</h3>
                                    <span className="text-2xl font-black text-primary">₹{item.price}</span>
                                </div>
                                <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-8 leading-relaxed">
                                    {item.description || "No description provided."}
                                </p>

                                <div className="flex items-center gap-3 pt-6 border-t border-gray-50">
                                    <Button
                                        variant="ghost"
                                        className="flex-1 h-12 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold"
                                        onClick={() => handleOpenModal(item)}
                                    >
                                        <Edit2 size={18} className="mr-2" /> Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="h-12 px-6 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all hover:scale-105"
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        <Trash2 size={18} className="mr-2" /> Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? 'Edit Culinary Masterpiece' : 'New Culinary Masterpiece'}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex gap-6 items-center p-6 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200 group relative">
                        <div className="h-24 w-24 bg-white rounded-2xl flex items-center justify-center shadow-inner overflow-hidden flex-shrink-0">
                            {imageFile ? (
                                <img src={URL.createObjectURL(imageFile)} className="h-full w-full object-cover" />
                            ) : formData.image ? (
                                <img src={formData.image} className="h-full w-full object-cover" />
                            ) : (
                                <ImageIcon className="text-gray-300" size={32} />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="font-black text-gray-900 text-sm mb-1 uppercase tracking-tight">Upload Product Image</p>
                            <p className="text-xs text-gray-500 font-medium italic">High resolution photos sell 3x faster.</p>
                            <input
                                type="file"
                                accept="image/*"
                                className="mt-3 block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
                                onChange={(e) => setImageFile(e.target.files[0])}
                            />
                        </div>
                    </div>

                    <Input
                        label="Dish Name"
                        placeholder="e.g. Truffle Mushroom Burger"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="h-14 rounded-2xl"
                    />

                    <Input
                        label="Price (₹)"
                        type="number"
                        placeholder="299"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                        className="h-14 rounded-2xl"
                    />

                    <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                        <textarea
                            className="w-full rounded-[32px] border-2 border-gray-100 bg-white p-6 text-sm font-medium focus:border-primary transition-all outline-none min-h-[120px]"
                            placeholder="Tell your customers about the magic in this dish..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, available: !formData.available })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.available ? 'bg-primary' : 'bg-gray-300'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.available ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                        <label className="text-sm font-bold text-gray-900">Available to customers?</label>
                    </div>

                    <Button type="submit" className="w-full h-16 rounded-[24px] text-lg font-black shadow-xl shadow-primary/30" isLoading={uploading}>
                        {editingItem ? 'Publish Updates' : 'Launch Dish 🚀'}
                    </Button>
                </form>
            </Modal>
        </div>
    );
};

export default FoodManagement;

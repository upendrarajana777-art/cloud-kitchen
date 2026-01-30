import { v4 as uuidv4 } from 'uuid';

/**
 * Gets the stored guestId from localStorage or generates a new one if it doesn't exist.
 * This acts as the persistent unique identifier for the customer.
 */
export const getGuestId = () => {
    let guestId = localStorage.getItem('guestId');
    if (!guestId) {
        guestId = `guest_${uuidv4()}`;
        localStorage.setItem('guestId', guestId);
    }
    return guestId;
};

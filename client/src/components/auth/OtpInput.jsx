import React, { useState, useRef, useEffect } from 'react';

const OtpInput = ({ length = 6, onComplete }) => {
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRefs = useRef([]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.value !== "" && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    useEffect(() => {
        const otpValue = otp.join("");
        if (otpValue.length === length) {
            onComplete(otpValue);
        }
    }, [otp]);

    return (
        <div className="flex justify-between gap-2 sm:gap-4">
            {otp.map((data, index) => {
                return (
                    <input
                        key={index}
                        type="text"
                        maxLength="1"
                        ref={(el) => (inputRefs.current[index] = el)}
                        value={data}
                        onChange={(e) => handleChange(e.target, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-white border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-0 transition-all outline-none shadow-sm"
                    />
                );
            })}
        </div>
    );
};

export default OtpInput;

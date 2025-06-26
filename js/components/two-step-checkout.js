// Export for window


// Two-Step Checkout Component with Phone OTP
const TwoStepCheckout = ({ cart, total, onClose, onSubmit }) => {
    const [step, setStep] = React.useState(1);
    const [verifiedPhone, setVerifiedPhone] = React.useState('');
    const [userData, setUserData] = React.useState(null);

    return React.createElement('div', { 
        className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50' 
    },
        React.createElement('div', { 
            className: 'bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto' 
        },
            step === 1 ? 
                React.createElement(PhoneVerificationStep, {
                    onVerified: (phone, user) => {
                        setVerifiedPhone(phone);
                        setUserData(user);
                        setStep(2);
                    },
                    onClose
                }) :
                React.createElement(OrderCompletionStep, {
                    phone: verifiedPhone,
                    userData,
                    cart,
                    total,
                    onClose,
                    onSubmit,
                    onBack: () => setStep(1)
                })
        )
    );
};

// Step 1: Phone Verification
const PhoneVerificationStep = ({ onVerified, onClose }) => {
    const [phone, setPhone] = React.useState('');
    const [otp, setOtp] = React.useState('');
    const [verificationId, setVerificationId] = React.useState('');
    const [showOtp, setShowOtp] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [recaptchaVerifier, setRecaptchaVerifier] = React.useState(null);

    React.useEffect(() => {
        // Initialize reCAPTCHA
        const verifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            size: 'invisible',
            callback: () => {
                console.log('reCAPTCHA verified');
            }
        });
        setRecaptchaVerifier(verifier);
        
        return () => verifier.clear();
    }, []);

    const sendOTP = async () => {
        if (!phone.trim()) {
            alert('Please enter phone number');
            return;
        }

        setLoading(true);
        try {
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            const verificationId = await phoneProvider.verifyPhoneNumber(
                phone, 
                recaptchaVerifier
            );
            setVerificationId(verificationId);
            setShowOtp(true);
            alert('OTP sent to your phone');
        } catch (error) {
            console.error('OTP send error:', error);
            alert('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };









const verifyOTP = async () => {
    if (!otp.trim()) {
        alert('Please enter OTP');
        return;
    }

    setLoading(true);
    try {
        const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId, 
            otp
        );
        const result = await firebase.auth().signInWithCredential(credential);
        
        // Check if user exists in database
        const firebaseService = new window.FirebaseService();
        const existingUser = await firebaseService.getUserByPhone(phone);
        
        onVerified(phone, existingUser);
    } catch (error) {
        console.error('OTP verification error:', error);
        alert('Invalid OTP. Please try again.');
        // Don't hide OTP input on error
    } finally {
        setLoading(false);
    }
};









    return React.createElement('div', { className: 'p-6' },
        React.createElement('div', { className: 'flex justify-between items-center mb-6' },
            React.createElement('h2', { className: 'text-xl font-semibold' }, 'Verify Phone Number'),
            React.createElement('button', {
                onClick: onClose,
                className: 'text-gray-500 hover:text-gray-700 text-2xl'
            }, '✕')
        ),

        !showOtp ? 
            // Phone input
            React.createElement('div', { className: 'space-y-4' },
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-medium mb-2' }, 'Phone Number'),
                    React.createElement('input', {
                        type: 'tel',
                        value: phone,
                        onChange: (e) => setPhone(e.target.value),
                        placeholder: '+1234567890',
                        className: 'w-full border rounded-lg px-3 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                    })
                ),
                React.createElement('div', { id: 'recaptcha-container' }),
                React.createElement('button', {
                    onClick: sendOTP,
                    disabled: loading,
                    className: 'w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50'
                }, loading ? 'Sending...' : 'Send OTP')
            ) :
            
            // OTP input
            React.createElement('div', { className: 'space-y-4' },
                React.createElement('div', { className: 'text-center mb-4' },
                    React.createElement('p', { className: 'text-gray-600' }, `OTP sent to ${phone}`),
                    React.createElement('button', {
                        onClick: () => setShowOtp(false),
                        className: 'text-orange-600 text-sm hover:underline'
                    }, 'Change number')
                ),
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-medium mb-2' }, 'Enter 6-digit OTP'),
                    React.createElement('input', {
                        type: 'text',
                        value: otp,
                        onChange: (e) => setOtp(e.target.value),
                        placeholder: '123456',
                        maxLength: 6,
                        className: 'w-full border rounded-lg px-3 py-3 text-lg text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500'
                    })
                ),
                React.createElement('button', {
                    onClick: verifyOTP,
                    disabled: loading,
                    className: 'w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50'
                }, loading ? 'Verifying...' : 'Verify OTP'),
                React.createElement('button', {
                    onClick: sendOTP,
                    className: 'w-full text-orange-600 py-2 text-sm hover:underline'
                }, 'Resend OTP')
            )
    );
};

// Step 2: Order Completion
const OrderCompletionStep = ({ phone, userData, cart, total, onClose, onSubmit, onBack }) => {
    const [formData, setFormData] = React.useState({
        name: userData?.name || '',
        phone: phone,
        email: userData?.email || '',
        address: userData?.address || '',
        specialInstructions: ''
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const { formatCurrency } = window.MenuCraftUtils || {};

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            alert('Please enter your name');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            alert('Error placing order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return React.createElement('div', { className: 'p-6' },
        React.createElement('div', { className: 'flex justify-between items-center mb-6' },
            React.createElement('div', null,
                React.createElement('h2', { className: 'text-xl font-semibold' }, 'Complete Order'),
                React.createElement('p', { className: 'text-sm text-green-600' }, `✓ ${phone} verified`)
            ),
            React.createElement('button', {
                onClick: onClose,
                className: 'text-gray-500 hover:text-gray-700 text-2xl'
            }, '✕')
        ),

        React.createElement('form', { onSubmit: handleSubmit },
            // Order Summary
            React.createElement('div', { className: 'mb-6' },
                React.createElement('h3', { className: 'font-semibold mb-3' }, 'Order Summary'),
                React.createElement('div', { className: 'max-h-32 overflow-y-auto space-y-1' },
                    cart.map(item =>
                        React.createElement('div', {
                            key: item.id,
                            className: 'flex justify-between text-sm py-1'
                        },
                            React.createElement('span', null, `${item.name} x${item.quantity}`),
                            React.createElement('span', null, formatCurrency ? formatCurrency(item.price * item.quantity) : `$${(item.price * item.quantity).toFixed(2)}`)
                        )
                    )
                ),
                React.createElement('div', { 
                    className: 'border-t mt-3 pt-3 flex justify-between font-semibold' 
                },
                    React.createElement('span', null, 'Total:'),
                    React.createElement('span', { className: 'text-orange-600' }, formatCurrency ? formatCurrency(total) : `$${total.toFixed(2)}`)
                )
            ),

            // Customer Details
            React.createElement('div', { className: 'space-y-4' },
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-medium mb-1' }, 'Name *'),
                    React.createElement('input', {
                        type: 'text',
                        required: true,
                        value: formData.name,
                        onChange: (e) => setFormData({...formData, name: e.target.value}),
                        className: 'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500'
                    })
                ),
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-medium mb-1' }, 'Delivery Address'),
                    React.createElement('input', {
                        type: 'text',
                        value: formData.address,
                        onChange: (e) => setFormData({...formData, address: e.target.value}),
                        className: 'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500'
                    })
                ),
                React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-medium mb-1' }, 'Special Instructions'),
                    React.createElement('textarea', {
                        value: formData.specialInstructions,
                        onChange: (e) => setFormData({...formData, specialInstructions: e.target.value}),
                        className: 'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500',
                        rows: 3
                    })
                )
            ),

            // Actions
            React.createElement('div', { className: 'flex gap-3 mt-6' },
                React.createElement('button', {
                    type: 'button',
                    onClick: onBack,
                    disabled: isSubmitting,
                    className: 'flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50'
                }, 'Back'),
                React.createElement('button', {
                    type: 'submit',
                    disabled: isSubmitting,
                    className: 'flex-2 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50'
                }, isSubmitting ? 'Placing Order...' : 'Place Order (COD)')
            )
        )
    );
};
window.TwoStepCheckout = TwoStepCheckout;
// Add getUserByPhone method to FirebaseService
// In firebase-service.js, add this method:
/*
async getUserByPhone(phone) {
    try {
        const snapshot = await this.db.collection('users')
            .where('phone', '==', phone)
            .limit(1)
            .get();
        
        if (!snapshot.empty) {
            return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        }
        return null;
    } catch (error) {
        console.error('Error fetching user by phone:', error);
        return null;
    }
}
*/
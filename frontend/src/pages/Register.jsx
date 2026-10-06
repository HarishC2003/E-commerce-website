import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const validatePassword = (pass) => {
    // 8 chars, 1 special, 1 capital, 1 number
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
    return regex.test(pass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email.includes('@')) {
      const msg = 'Please enter a valid email address with @';
      setError(msg);
      showToast(msg, "error");
      return;
    }

    if (!validatePassword(password)) {
      const msg = 'Password must have at least 8 characters, one special character, one capital letter, and one number.';
      setError(msg);
      showToast(msg, "error");
      return;
    }

    if (password !== confirmPassword) {
      const msg = 'Password and confirm password do not match.';
      setError(msg);
      showToast(msg, "error");
      return;
    }

    try {
      await register(name, email, password);
      setSuccess(true);
      showToast("Registration successful, login now.", "success");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg);
      showToast(errorMsg, "error");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success" style={{color: 'green', marginBottom: '1rem', fontWeight: 'bold'}}>Register successful, login now.</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ position: 'relative' }}>
          <label>Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ paddingRight: '60px' }}
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: '10px', top: '35px', width: 'auto', padding: '0', background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '0.9rem' }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div style={{ position: 'relative' }}>
          <label>Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ paddingRight: '60px' }}
          />
          <button 
            type="button" 
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{ position: 'absolute', right: '10px', top: '35px', width: 'auto', padding: '0', background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '0.9rem' }}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Register;

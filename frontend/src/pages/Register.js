import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { username, email, password, confirmPassword } = formData;

        // Validation
        if (!username || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (username.length < 3) {
            setError('Username must be at least 3 characters long');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        const result = await register(username, email, password);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
        
        setLoading(false);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={6} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3, fontWeight: 'bold' }}>
                    Create Account
                </Typography>
                <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
                    Sign up to start chatting
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        required
                        autoComplete="username"
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        required
                        autoComplete="email"
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        required
                        autoComplete="new-password"
                    />
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        required
                        autoComplete="new-password"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        sx={{ mt: 3, mb: 2, py: 1.5 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Sign Up'}
                    </Button>
                </form>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2">
                        Already have an account?{' '}
                        <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}>
                            Sign In
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}

export default Register;

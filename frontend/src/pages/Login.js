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

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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

        const { email, password } = formData;

        // Basic validation
        if (!email || !password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        const result = await login(email, password);

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
                    Welcome Back
                </Typography>
                <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
                    Sign in to continue to chat
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
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
                        autoComplete="current-password"
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
                        {loading ? <CircularProgress size={24} /> : 'Sign In'}
                    </Button>
                </form>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2">
                        Don't have an account?{' '}
                        <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}>
                            Sign Up
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}

export default Login;

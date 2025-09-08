import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  ArrowRight, 
  Shield, 
  Zap, 
  CheckCircle,
  X,
  TrendingUp,
  Award,
  Phone
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthForm } from '../types';

const Login: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState<AuthForm>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Partial<AuthForm>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup, isAdmin } = useAuth();
  const [isAdminSignup, setIsAdminSignup] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Partial<AuthForm> = {};

    if (!form.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!form.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (form.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (isSignup) {
      if (!form.firstName) {
        newErrors.firstName = 'Le prénom est requis';
      } else if (form.firstName.length < 2) {
        newErrors.firstName = 'Le prénom doit contenir au moins 2 caractères';
      }

      if (!form.lastName) {
        newErrors.lastName = 'Le nom est requis';
      } else if (form.lastName.length < 2) {
        newErrors.lastName = 'Le nom doit contenir au moins 2 caractères';
      }

      if (!form.phone) {
        newErrors.phone = 'Le numéro de téléphone est requis';
      } else if (!/^[\+]?[0-9\s\-\(\)]{8,}$/.test(form.phone)) {
        newErrors.phone = 'Numéro de téléphone invalide';
      }

      if (!form.confirmPassword) {
        newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
      } else if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let success = false;
      
      if (isSignup) {
        const fullName = `${form.firstName} ${form.lastName}`;
        success = await signup(fullName, form.email, form.password, isAdminSignup ? 'admin' : 'client');
      } else {
        success = await login(form.email, form.password);
      }

      if (success) {
        const r = localStorage.getItem('role');
        navigate(r === 'admin' ? '/admin' : '/');
      } else {
        setErrors({ 
          email: isSignup ? 'Erreur lors de l\'inscription' : 'Email ou mot de passe incorrect' 
        });
      }
    } catch (error) {
      setErrors({ email: 'Une erreur est survenue' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof AuthForm]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setForm({ email: '', password: '', firstName: '', lastName: '', phone: '', confirmPassword: '' });
    setErrors({});
    setIsAdminSignup(false);
  };

  const features = [
    { 
      icon: <Shield className="w-5 h-5" />, 
      title: "Sécurité Enterprise", 
      description: "Protection de niveau bancaire pour vos données",
      color: "text-blue-500" 
    },
    { 
      icon: <Zap className="w-5 h-5" />, 
      title: "Performance", 
      description: "Interface ultra-rapide et optimisée",
      color: "text-green-500" 
    },
    { 
      icon: <TrendingUp className="w-5 h-5" />, 
      title: "Innovation", 
      description: "Technologies de pointe et IA intégrée",
      color: "text-purple-500" 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #1A2A80 2px, transparent 2px), radial-gradient(circle at 75% 75%, #3B38A0 2px, transparent 2px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Geometric Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl"
          animate={{ scale: [1, 0.9, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Brand & Features */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl mb-8 shadow-lg"
            >
              <Award className="w-8 h-8 text-white" />
            </motion.div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {isSignup ? 'Rejoignez l\'excellence' : 'Bienvenue'}
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-lg">
              {isSignup 
                ? 'Accédez à une plateforme de commerce électronique de nouvelle génération, conçue pour les professionnels exigeants.'
                : 'Connectez-vous à votre espace professionnel et accédez à toutes nos fonctionnalités avancées.'
              }
            </p>

            {/* Features */}
            <div className="space-y-6 mb-12">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className={`flex-shrink-0 w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-gray-600">Clients satisfaits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-gray-600">Disponibilité</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-md">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8"
              >
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                    className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <User className="w-6 h-6 text-white" />
                  </motion.div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {isSignup ? 'Créer un compte' : 'Connexion'}
                  </h2>
                  <p className="text-gray-600">
                    {isSignup 
                      ? 'Commencez votre expérience professionnelle'
                      : 'Accédez à votre espace sécurisé'
                    }
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <AnimatePresence mode="wait">
                    {isSignup && (
                      <>
                        <div className="flex items-center mb-2">
                          <input
                            id="isAdminSignup"
                            type="checkbox"
                            checked={isAdminSignup}
                            onChange={(e) => setIsAdminSignup(e.target.checked)}
                            className="mr-2"
                          />
                          <label htmlFor="isAdminSignup" className="text-sm text-gray-700">Créer en tant qu'admin</label>
                        </div>
                        {/* Row 1: First Name, Last Name */}
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="grid grid-cols-2 gap-4"
                        >
                          <div>
                            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                              Prénom
                            </label>
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all duration-300 ${
                                  errors.firstName ? 'border-red-300 bg-red-50' : ''
                                }`}
                                placeholder="Prénom"
                              />
                            </div>
                            {errors.firstName && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 text-sm text-red-600 flex items-center"
                              >
                                <X className="w-4 h-4 mr-1" />
                                {errors.firstName}
                              </motion.p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                              Nom
                            </label>
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all duration-300 ${
                                  errors.lastName ? 'border-red-300 bg-red-50' : ''
                                }`}
                                placeholder="Nom"
                              />
                            </div>
                            {errors.lastName && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 text-sm text-red-600 flex items-center"
                              >
                                <X className="w-4 h-4 mr-1" />
                                {errors.lastName}
                              </motion.p>
                            )}
                          </div>
                        </motion.div>

                        {/* Row 2: Email, Phone */}
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="grid grid-cols-2 gap-4"
                        >
                          <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                              Email
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="email"
                                id="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all duration-300 ${
                                  errors.email ? 'border-red-300 bg-red-50' : ''
                                }`}
                                placeholder="votre@email.com"
                              />
                            </div>
                            {errors.email && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 text-sm text-red-600 flex items-center"
                              >
                                <X className="w-4 h-4 mr-1" />
                                {errors.email}
                              </motion.p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                              Téléphone
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all duration-300 ${
                                  errors.phone ? 'border-red-300 bg-red-50' : ''
                                }`}
                                placeholder="+33 6 12 34 56 78"
                              />
                            </div>
                            {errors.phone && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 text-sm text-red-600 flex items-center"
                              >
                                <X className="w-4 h-4 mr-1" />
                                {errors.phone}
                              </motion.p>
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>

                  {/* Login Email Field */}
                  {!isSignup && (
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Adresse email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all duration-300 ${
                            errors.email ? 'border-red-300 bg-red-50' : ''
                          }`}
                          placeholder="votre@email.com"
                        />
                      </div>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-600 flex items-center"
                        >
                          <X className="w-4 h-4 mr-1" />
                          {errors.email}
                        </motion.p>
                      )}
                    </div>
                  )}

                  {/* Row 3: Password, Confirm Password (Signup) or just Password (Login) */}
                  <div className={isSignup ? "grid grid-cols-2 gap-4" : ""}>
                    <div>
                      <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                        Mot de passe
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all duration-300 ${
                            errors.password ? 'border-red-300 bg-red-50' : ''
                          }`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-600 flex items-center"
                        >
                          <X className="w-4 h-4 mr-1" />
                          {errors.password}
                        </motion.p>
                      )}
                    </div>

                    <AnimatePresence mode="wait">
                      {isSignup && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                            Confirmer
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              id="confirmPassword"
                              name="confirmPassword"
                              value={form.confirmPassword}
                              onChange={handleChange}
                              className={`w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all duration-300 ${
                                errors.confirmPassword ? 'border-red-300 bg-red-50' : ''
                              }`}
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                          {errors.confirmPassword && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 text-sm text-red-600 flex items-center"
                            >
                              <X className="w-4 h-4 mr-1" />
                              {errors.confirmPassword}
                            </motion.p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-semibold hover:from-secondary hover:to-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{isSignup ? 'Créer mon compte' : 'Se connecter'}</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    {isSignup ? 'Déjà un compte ?' : 'Pas encore de compte ?'}
                    <button
                      onClick={toggleMode}
                      className="ml-2 text-primary hover:text-secondary font-semibold transition-colors"
                    >
                      {isSignup ? 'Se connecter' : 'Créer un compte'}
                    </button>
                  </p>
                </div>

                {!isSignup && (
                  <div className="mt-4 text-center">
                    <Link
                      to="/"
                      className="text-sm text-gray-500 hover:text-primary transition-colors"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
                )}


              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;


                                type="text"

                                id="firstName"

                                name="firstName"

                                value={form.firstName}

                                onChange={handleChange}

                                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all duration-300 ${

                                  errors.firstName ? 'border-red-300 bg-red-50' : ''

                                }`}

                                placeholder="Prénom"

                              />

                            </div>

                            {errors.firstName && (

                              <motion.p

                                initial={{ opacity: 0, y: -10 }}

                                animate={{ opacity: 1, y: 0 }}

                                className="mt-2 text-sm text-red-600 flex items-center"

                              >

                                <X className="w-4 h-4 mr-1" />

                                {errors.firstName}

                              </motion.p>

                            )}

                          </div>



                          <div>

                            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">

                              Nom

                            </label>

                            <div className="relative">

                              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                              <input

                                type="text"

                                id="lastName"

                                name="lastName"

                                value={form.lastName}

                                onChange={handleChange}

                                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all duration-300 ${

                                  errors.lastName ? 'border-red-300 bg-red-50' : ''

                                }`}

                                placeholder="Nom"

                              />

                            </div>

                            {errors.lastName && (

                              <motion.p

                                initial={{ opacity: 0, y: -10 }}

                                animate={{ opacity: 1, y: 0 }}

                                className="mt-2 text-sm text-red-600 flex items-center"

                              >

                                <X className="w-4 h-4 mr-1" />

                                {errors.lastName}

                              </motion.p>

                            )}

                          </div>

                        </motion.div>



                        {/* Row 2: Email, Phone */}

                        <motion.div

                          initial={{ opacity: 0, height: 0 }}

                          animate={{ opacity: 1, height: "auto" }}

                          exit={{ opacity: 0, height: 0 }}

                          transition={{ duration: 0.3, delay: 0.1 }}

                          className="grid grid-cols-2 gap-4"

                        >

                          <div>

                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">

                              Email

                            </label>

                            <div className="relative">

                              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                              <input

                                type="email"

                                id="email"

                                name="email"

                                value={form.email}

                                onChange={handleChange}

                                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all duration-300 ${

                                  errors.email ? 'border-red-300 bg-red-50' : ''

                                }`}

                                placeholder="votre@email.com"

                              />

                            </div>

                            {errors.email && (

                              <motion.p

                                initial={{ opacity: 0, y: -10 }}

                                animate={{ opacity: 1, y: 0 }}

                                className="mt-2 text-sm text-red-600 flex items-center"

                              >

                                <X className="w-4 h-4 mr-1" />

                                {errors.email}

                              </motion.p>

                            )}

                          </div>



                          <div>

                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">

                              Téléphone

                            </label>

                            <div className="relative">

                              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                              <input

                                type="tel"

                                id="phone"

                                name="phone"

                                value={form.phone}

                                onChange={handleChange}

                                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all duration-300 ${

                                  errors.phone ? 'border-red-300 bg-red-50' : ''

                                }`}

                                placeholder="+33 6 12 34 56 78"

                              />

                            </div>

                            {errors.phone && (

                              <motion.p

                                initial={{ opacity: 0, y: -10 }}

                                animate={{ opacity: 1, y: 0 }}

                                className="mt-2 text-sm text-red-600 flex items-center"

                              >

                                <X className="w-4 h-4 mr-1" />

                                {errors.phone}

                              </motion.p>

                            )}

                          </div>

                        </motion.div>

                      </>

                    )}

                  </AnimatePresence>



                  {/* Login Email Field */}

                  {!isSignup && (

                    <div>

                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">

                        Adresse email

                      </label>

                      <div className="relative">

                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                        <input

                          type="email"

                          id="email"

                          name="email"

                          value={form.email}

                          onChange={handleChange}

                          className={`w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all duration-300 ${

                            errors.email ? 'border-red-300 bg-red-50' : ''

                          }`}

                          placeholder="votre@email.com"

                        />

                      </div>

                      {errors.email && (

                        <motion.p

                          initial={{ opacity: 0, y: -10 }}

                          animate={{ opacity: 1, y: 0 }}

                          className="mt-2 text-sm text-red-600 flex items-center"

                        >

                          <X className="w-4 h-4 mr-1" />

                          {errors.email}

                        </motion.p>

                      )}

                    </div>

                  )}



                  {/* Row 3: Password, Confirm Password (Signup) or just Password (Login) */}

                  <div className={isSignup ? "grid grid-cols-2 gap-4" : ""}>

                    <div>

                      <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">

                        Mot de passe

                      </label>

                      <div className="relative">

                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                        <input

                          type={showPassword ? 'text' : 'password'}

                          id="password"

                          name="password"

                          value={form.password}

                          onChange={handleChange}

                          className={`w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all duration-300 ${

                            errors.password ? 'border-red-300 bg-red-50' : ''

                          }`}

                          placeholder="••••••••"

                        />

                        <button

                          type="button"

                          onClick={() => setShowPassword(!showPassword)}

                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"

                        >

                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}

                        </button>

                      </div>

                      {errors.password && (

                        <motion.p

                          initial={{ opacity: 0, y: -10 }}

                          animate={{ opacity: 1, y: 0 }}

                          className="mt-2 text-sm text-red-600 flex items-center"

                        >

                          <X className="w-4 h-4 mr-1" />

                          {errors.password}

                        </motion.p>

                      )}

                    </div>



                    <AnimatePresence mode="wait">

                      {isSignup && (

                        <motion.div

                          initial={{ opacity: 0, height: 0 }}

                          animate={{ opacity: 1, height: "auto" }}

                          exit={{ opacity: 0, height: 0 }}

                          transition={{ duration: 0.3, delay: 0.2 }}

                        >

                          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">

                            Confirmer

                          </label>

                          <div className="relative">

                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                            <input

                              type={showConfirmPassword ? 'text' : 'password'}

                              id="confirmPassword"

                              name="confirmPassword"

                              value={form.confirmPassword}

                              onChange={handleChange}

                              className={`w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all duration-300 ${

                                errors.confirmPassword ? 'border-red-300 bg-red-50' : ''

                              }`}

                              placeholder="••••••••"

                            />

                            <button

                              type="button"

                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}

                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"

                            >

                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}

                            </button>

                          </div>

                          {errors.confirmPassword && (

                            <motion.p

                              initial={{ opacity: 0, y: -10 }}

                              animate={{ opacity: 1, y: 0 }}

                              className="mt-2 text-sm text-red-600 flex items-center"

                            >

                              <X className="w-4 h-4 mr-1" />

                              {errors.confirmPassword}

                            </motion.p>

                          )}

                        </motion.div>

                      )}

                    </AnimatePresence>

                  </div>



                  <motion.button

                    type="submit"

                    disabled={isLoading}

                    whileHover={{ scale: 1.02 }}

                    whileTap={{ scale: 0.98 }}

                    className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-semibold hover:from-secondary hover:to-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"

                  >

                    {isLoading ? (

                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />

                    ) : (

                      <>

                        <span>{isSignup ? 'Créer mon compte' : 'Se connecter'}</span>

                        <ArrowRight className="w-5 h-5" />

                      </>

                    )}

                  </motion.button>

                </form>



                <div className="mt-6 text-center">

                  <p className="text-gray-600">

                    {isSignup ? 'Déjà un compte ?' : 'Pas encore de compte ?'}

                    <button

                      onClick={toggleMode}

                      className="ml-2 text-primary hover:text-secondary font-semibold transition-colors"

                    >

                      {isSignup ? 'Se connecter' : 'Créer un compte'}

                    </button>

                  </p>

                </div>



                {!isSignup && (

                  <div className="mt-4 text-center">

                    <Link

                      to="/"

                      className="text-sm text-gray-500 hover:text-primary transition-colors"

                    >

                      Mot de passe oublié ?

                    </Link>

                  </div>

                )}





              </motion.div>

            </div>

          </motion.div>

        </div>

      </div>

    </div>

  );

};



export default Login;


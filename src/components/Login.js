import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Test kullanıcısı kontrolü
      if (userCredential.user.email === 'test@example.com') {
        console.log('Test user login successful');
        return; // Admin kontrolü yapma
      }
      
      // Admin kontrolü
      const adminDoc = await getDoc(doc(db, 'admins', userCredential.user.uid));
      if (!adminDoc.exists()) {
        await auth.signOut();
        setError('Bu uygulamaya erişim yetkiniz bulunmamaktadır. Lütfen admin ile iletişime geçin.');
        return;
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setError('Bu e-posta adresi kayıtlı değil. Lütfen admin ile iletişime geçin.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Hatalı şifre.');
      } else {
        setError('Giriş yapılırken bir hata oluştu: ' + error.message);
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Giriş Yap</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Giriş Yap</button>
      </form>
      <p className="login-info">
        * Bu uygulama sadece yetkili kullanıcılar içindir. <br />
        Erişim için lütfen admin ile iletişime geçin.
      </p>
    </div>
  );
}

export default Login; 
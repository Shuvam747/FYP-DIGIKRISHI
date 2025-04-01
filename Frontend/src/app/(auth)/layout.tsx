import React from 'react';
import { Navbar } from '../component/navbar';
import { Footer } from '../component/footer';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default AuthLayout;

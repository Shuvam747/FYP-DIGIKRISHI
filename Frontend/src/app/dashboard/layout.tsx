import React from 'react';
import { Footer } from '../component/footer';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default AuthLayout;

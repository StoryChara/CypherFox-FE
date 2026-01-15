// src/routes/Methods/Methods.jsx
import React, { useState } from 'react';
import './Methods.css';
import { Methods_Full } from '../../components/Methods';

import FloatingLines from '../../components/FloatingLines';

const Methods = () => {
  const [labsUsuario, setLabsUsuario] = useState({
    'One-Time Pad': true,
    Caesar: true,
    Vigenère: false,
    Hill: true,
  });

  const metodoCards = Methods_Full({ labs_usuario: labsUsuario });

  return (
    <div className="cf-methods-page">
      <div className="cf-methods-bg">
        <FloatingLines
          linesGradient={['#138245', '#06040E', '#E78F41', '#06040E']}
          enabledWaves={['middle', 'top', 'bottom']}
          lineCount={8}
          lineDistance={100}
          bendRadius={1}
          bendStrength={0}
          mixBlendMode="normal"
          interactive={false}
          backgroundHex="#050211"
          backgroundMix={0.8}
        />
      </div>

      <div className="cf-methods-content">
        <section className="cf-methods-header">
          <h1 className="cf-methods-header-title">Métodos de Encriptación</h1>
          <p className="cf-methods-header-description">
            Explora en detalle cada técnica criptográfica, desde los métodos
            clásicos hasta los algoritmos modernos más avanzados
          </p>
        </section>

        <section className="cf-methods-list container-lg">
          <div className="row g-4">
            {metodoCards.map((card) => (
              <div
                key={card.key}
                className="col-12 col-md-6 col-xl-4 d-flex"
              >
                <div className="flex-grow-1">
                  {card}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Methods;
// src/components/Methods.jsx
import { Link } from 'react-router-dom';
import { metodos } from '../util/metodos.js';
import './Methods.css';

export const Methods_Short = () => {
    return metodos.map((metodo) => (
        <Link
            key={metodo.nombre}
            to={metodo.href}
            className="cf-method-card"
        >
            <div className="cf-method-icon">
                <i className={metodo.icono} aria-hidden="true"></i>
            </div>
            <div className="cf-method-info">
                <h3 className="cf-method-name">{metodo.nombre}</h3>
                <p className="cf-method-description">{metodo.descripcion_corta}</p>
            </div>
        </Link>
    ));
};

export const More_Short = () => {
    return (
        <Link to="/metodos" className="cf-method-card">
            <div className="cf-method-icon">
                <i className="fa-solid fa-plus" aria-hidden="true"></i>
            </div>
            <div className="cf-method-info">
                <h3 className="cf-method-name">Más...</h3>
                <p className="cf-method-description">
                    Muchos más cifrados...
                </p>
            </div>
        </Link>
    );
};
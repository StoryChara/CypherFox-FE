// src/components/HomeHero.jsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Orb from '../components/Orb.jsx';
import logo from '../assets/logo.svg';
import './Home.css';
import { Methods_Short, More_Short } from '../components/Methods.jsx';

gsap.registerPlugin(ScrollTrigger);

const fakeRanking = [
    { usuario: 'MaestroEncriptación', puntos: '8,247' },
    { usuario: 'CódigoSeguro', puntos: '7,156' },
    { usuario: 'CazadorHash', puntos: '6,923' },
    { usuario: 'SabioCifrado', puntos: '5,687' },
    { usuario: 'RompeClaves', puntos: '5,445' },
    { usuario: 'AlgoritmoAs', puntos: '4,892' },
    { usuario: 'CryptoNinja', puntos: '4,234' },
    { usuario: 'DescifraMax', puntos: '3,876' },
    { usuario: 'HashMaster', puntos: '3,567' },
    { usuario: 'CifradoPro', puntos: '3,234' }
];

const Home = () => {
    const heroRef = useRef(null);
    const metodosRef = useRef(null);
    const rankingRef = useRef(null);

    // HERO
    useEffect(() => {
        if (!heroRef.current) return;

        const ctx = gsap.context(() => {
            const section = heroRef.current;
            const orb = section.querySelector('.cf-hero-orb-layer');
            const logo = section.querySelector('.cf-hero-logo');
            const text = section.querySelector('.cf-hero-subtitle');
            const buttons = section.querySelectorAll('.cf-hero-actions .cf-hero-btn');

            // Estado inicial
            gsap.set(orb, { opacity: 0, scale: 1.1 });
            gsap.set(logo, { opacity: 0, y: 30 });
            gsap.set(text, { opacity: 0, y: 20 });
            gsap.set(buttons, { opacity: 0, y: 15 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',          // cuando el top del hero entra al 80% del viewport
                    end: 'bottom 40%',
                    toggleActions: 'play none none reverse',
                },
            });

            tl.to(orb, {
                opacity: 1,
                scale: 1,
                duration: 0.9,
                ease: 'power2.out',
            })
                .to(
                    logo,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out',
                    },
                    '-=0.5'
                )
                .to(
                    text,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: 'power2.out',
                    },
                    '-=0.25'
                )
                .to(
                    buttons,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        ease: 'power2.out',
                        stagger: 0.1,
                    },
                    '-=0.15'
                );
        }, heroRef);

        return () => ctx.revert();
    }, []);

    // MÉTODOS
    useEffect(() => {
        if (!metodosRef.current) return;

        const ctx = gsap.context(() => {
            const section = metodosRef.current;
            const header = section.querySelector('.cf-metodos-header');
            const cards = section.querySelectorAll('.cf-metodos-slide-wrapper');

            gsap.set([header, cards], {
                opacity: 0,
                y: 30,
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                    end: 'bottom 40%',
                    toggleActions: 'play none none reverse',
                },
            });

            tl.to(header, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
            }).to(
                cards,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out',
                    stagger: 0.15,
                },
                '-=0.2'
            );
        }, metodosRef);

        return () => ctx.revert();
    }, []);

    // RANKING
    useEffect(() => {
        if (!rankingRef.current) return;

        const ctx = gsap.context(() => {
            const section = rankingRef.current;
            const header = section.querySelector('.cf-ranking-header');
            const wrapper = section.querySelector('.cf-ranking-table-wrapper');
            const rows = section.querySelectorAll('.cf-ranking-table tbody tr');

            gsap.set(header, { opacity: 0, y: 30 });
            gsap.set(wrapper, { opacity: 0, y: 40, scale: 0.97 });
            gsap.set(rows, { opacity: 0, x: -20 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                    end: 'bottom 40%',
                    toggleActions: 'play none none reverse',
                },
            });

            tl.to(header, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
            })
                .to(
                    wrapper,
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.6,
                        ease: 'power2.out',
                    },
                    '-=0.25'
                )
                .to(
                    rows,
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.4,
                        ease: 'power2.out',
                        stagger: 0.06,
                    },
                    '-=0.25'
                );
        }, rankingRef);

        return () => ctx.revert();
    }, []);

    return (
        <>
            {/* HERO */}
            <section className="cf-hero" ref={heroRef}>
                <div className="cf-hero-orb-layer">
                    <Orb hue={130} />
                </div>

                <div className="cf-hero-content">
                    <div className="cf-hero-logo">
                        <img src={logo} alt="CypherFox logo" className="cf-hero-logo-img" />
                        <h1 className="logo cf-hero-logo-text">CypherFox</h1>
                    </div>

                    <p className="cf-hero-subtitle">
                        Domina el arte de la criptografía aprende los fundamentos de la criptografía
                        a través de simulaciones interactivas, visualizaciones claras y desafíos
                        prácticos evaluados automáticamente.
                    </p>

                    <div className="cf-hero-actions">
                        <a href="/metodos" className="cf-hero-btn cf-hero-btn-primary">
                            Explorar Métodos
                        </a>
                        <a href="/ranking" className="cf-hero-btn cf-hero-btn-secondary">
                            Ver Ranking
                        </a>
                    </div>
                </div>
            </section>

            {/* MÉTODOS */}
            <section className="cf-metodos" ref={metodosRef}>
                <div className="cf-metodos-header">
                    <h2 className="cf-metodos-title">Métodos Criptográficos</h2>
                    <p className="cf-metodos-subtitle">
                        Explora diversas técnicas y algoritmos criptográficos
                    </p>
                </div>

                <div className="cf-metodos-list">
                    {Methods_Short()
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 3)
                        .map((card, index) => (
                            <div key={index} className="cf-metodos-slide-wrapper">
                                {card}
                            </div>
                        ))}
                    <div className="cf-metodos-slide-wrapper">
                        <More_Short />
                    </div>
                </div>
            </section>

            {/* RANKING */}
            <section className="cf-ranking" ref={rankingRef}>
                <div className="cf-ranking-header">
                    <h2 className="cf-ranking-title">TABLA DE POSICIONES</h2>
                    <p className="cf-ranking-subtitle">
                        Los mejores estudiantes en nuestros desafíos de criptografía
                    </p>
                    <h3 className="cf-ranking-period">TOP USUARIOS DEL SEMESTRE</h3>
                </div>

                <div className="cf-ranking-table-wrapper">
                    <table className="cf-ranking-table">
                        <thead>
                            <tr>
                                <th>POSICIÓN</th>
                                <th>USUARIO</th>
                                <th>PUNTOS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fakeRanking.map((row, idx) => (
                                <tr
                                    key={row.usuario}
                                    className={idx % 2 === 0 ? 'cf-ranking-row--top' : 'cf-ranking-row--bot'}
                                >
                                    <td className="cf-ranking-pos">
                                        {idx === 0
                                            ? '🥇'
                                            : idx === 1
                                                ? '🥈'
                                                : idx === 2
                                                    ? '🥉'
                                                    : idx === 3
                                                        ? '🏅'
                                                        : idx === 4
                                                            ? '🎖️'
                                                            : ''}{' '}
                                        #{idx + 1}
                                    </td>
                                    <td className="cf-ranking-user">{row.usuario}</td>
                                    <td className="cf-ranking-points">{row.puntos}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <a href="/ranking" className="cf-ranking-link">
                        Ver Tabla Completa →
                    </a>
                </div>
            </section>
        </>
    );
};

export default Home;
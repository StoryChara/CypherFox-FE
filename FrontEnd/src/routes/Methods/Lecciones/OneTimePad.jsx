// routes/Methods/Lecciones/OneTimePad.jsx
import { useState, useRef, useEffect } from "react";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

import "./OneTimePad.css";

import Welcome from "../../../assets/welcome.gif";
import Study from "../../../assets/study.gif";
import Help from "../../../assets/help.gif";

import DecryptedText from "../../../components/text/DecryptedText";
import TextType from "../../../components/text/TextType";
import ScrambledText from "../../../components/text/ScrambleText";

import { gsap } from "gsap";

function OneTimePad() {
    // --- Estado general ---
    const [showXorHelp, setShowXorHelp] = useState(false);
    const [showAlphaHelp, setShowAlphaHelp] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    // --- Estado laboratorio binario ---
    const [binaryPlain, setBinaryPlain] = useState("101010");
    const [binaryKey, setBinaryKey] = useState("110011");

    // --- Estado laboratorio alfabético ---
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const n = alphabet.length;

    const [alphaPlain, setAlphaPlain] = useState("ONE TIME PAD");
    const [alphaKey, setAlphaKey] = useState("SEC RETS ECR");

    // --- Helpers OTP binario ---
    const cleanBinary = (s) => s.replace(/[^01]/g, "");

    const xorBit = (a, b) => {
        if (a === "0" && b === "0") return "0";
        if (a === "0" && b === "1") return "1";
        if (a === "1" && b === "0") return "1";
        if (a === "1" && b === "1") return "0";
        return "0";
    };

    const binaryCipher = (() => {
        const m = cleanBinary(binaryPlain);
        const k = cleanBinary(binaryKey);
        const len = Math.min(m.length, k.length);
        let out = "";
        for (let i = 0; i < len; i++) {
            out += xorBit(m[i], k[i]);
        }
        return out;
    })();

    // --- Helpers OTP alfabeto ---
    const letterToIndex = (ch) => {
        const idx = alphabet.indexOf(ch.toUpperCase());
        return idx; // -1 si no está
    };

    const indexToLetter = (idx) => {
        if (idx < 0) idx = ((idx % n) + n) % n;
        return alphabet[idx % n];
    };

    const encodeAlphaOtp = (plain, key) => {
        let out = "";
        const cleanedPlain = plain.toUpperCase();
        const cleanedKey = key.toUpperCase();

        for (let i = 0, j = 0; i < cleanedPlain.length; i++) {
            const ch = cleanedPlain[i];
            const pIdx = letterToIndex(ch);
            if (pIdx === -1) {
                // espacio, signo, etc. se deja tal cual
                out += ch;
                continue;
            }
            if (j >= cleanedKey.length) {
                // si la clave se queda corta, dejamos de cifrar el resto
                // (ciclarla rompería la idea de One-Time "Pad")
                out += ch;
                continue;
            }
            const kCh = cleanedKey[j];
            const kIdx = letterToIndex(kCh);
            if (kIdx === -1) {
                // si el caracter de clave no es letra, saltamos a la siguiente
                j++;
                i--;
                continue;
            }
            const cIdx = (pIdx + kIdx) % n;
            out += indexToLetter(cIdx);
            j++;
        }
        return out;
    };

    const alphaCipher = encodeAlphaOtp(alphaPlain, alphaKey);

    // ---------- REFS PARA GSAP ----------
    const heroRef = useRef(null);
    const heroCircleRef = useRef(null);
    const heroMascotRef = useRef(null);
    const bandBinaryRef = useRef(null);
    const mathBinaryRef = useRef(null);
    const mathAlphaRef = useRef(null);
    const gameAlphaRef = useRef(null);
    const missionsCardRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: "power3.out", duration: 0.6 },
            });

            tl.from(heroRef.current, { opacity: 0, y: 20 });
            tl.from(
                heroCircleRef.current,
                { opacity: 0, scale: 0.8 },
                "-=0.3"
            );
            tl.from(
                heroMascotRef.current,
                { opacity: 0, x: -20 },
                "-=0.4"
            );

            tl.from(
                bandBinaryRef.current,
                { opacity: 0, y: 24 },
                "-=0.2"
            );
            tl.from(
                mathBinaryRef.current,
                { opacity: 0, y: 24 },
                "+=0.1"
            );
            tl.from(
                mathAlphaRef.current,
                { opacity: 0, y: 24 },
                "-=0.3"
            );
            tl.from(
                gameAlphaRef.current,
                { opacity: 0, y: 24 },
                "+=0.1"
            );
            tl.from(
                missionsCardRef.current,
                { opacity: 0, y: 24 },
                "+=0.1"
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="otp-page">
            <div className="container otp-shell">
                {/* HERO */}
                <section className="otp-hero">
                    <div className="hero-copy" ref={heroRef}>
                        <span className="hero-badge">Lección · Cifrado perfecto</span>
                        <h1>
                            Juega con el{" "}
                            <DecryptedText
                                text="One-Time Pad"
                                className="hero-copy-tittle"
                                encryptedClassName="hero-copy-tittle text-encrypted"
                                speed={120}
                                maxIterations={60}
                            />
                        </h1>
                        <div>
                            <TextType
                                text="Un mensaje M, una clave K del mismo tamaño y una operación XOR. Descubre cómo algo tan simple puede darte una seguridad matemáticamente perfecta (si se usa bien)."
                                as="span"
                                typingSpeed={25}
                                deletingSpeed={65}
                                pauseDuration={1800}
                                textColors={["var(--cf-text)"]}
                            />
                        </div>
                    </div>

                    <div className="hero-visual">
                        <img
                            src={Welcome}
                            alt="CypherFox dando la bienvenida al One-Time Pad"
                            className="hero-mascot"
                            ref={heroMascotRef}
                        />
                        <div
                            className="hero-circle hero-circle-main"
                            ref={heroCircleRef}
                        >
                            <div className="hero-circle-inner">
                                <span className="k-label">M ⊕ K</span>
                                <span className="k-value">C</span>
                            </div>
                        </div>
                        <div className="hero-circle hero-circle-small hero-circle-1" />
                        <div className="hero-circle hero-circle-small hero-circle-2" />
                    </div>
                </section>

                {/* FRANJA 1: Laboratorio binario + explicación matemática XOR */}
                <section className="otp-band band-binary">
                    <div className="band-binary-inner" ref={bandBinaryRef}>
                        <div className="lab-core">
                            <h2>
                                <DecryptedText
                                    text="OTP en binario"
                                    className="hero-copy-tittle"
                                    encryptedClassName="hero-copy-tittle text-encrypted"
                                    speed={120}
                                    maxIterations={60}
                                />
                            </h2>
                            <header className="lab-header-row row g-2 align-items-start">
                                {/* Columna izquierda: título + 2 líneas de descripción (6 columnas en lg) */}
                                <div className="col-12 col-lg-6">
                                    <div className="lab-subtitle">
                                        <TextType
                                            text="Trabajaremos con bits: cada posición del mensaje se combina con la clave usando XOR."
                                            as="span"
                                            typingSpeed={25}
                                            deletingSpeed={65}
                                            pauseDuration={1800}
                                            textColors={["var(--cf-text)"]}
                                        />
                                    </div>

                                    <div className="lab-subtitle">
                                        <TextType
                                            text="Juega cambiando M y K y observa cómo cambia C."
                                            as="span"
                                            typingSpeed={25}
                                            deletingSpeed={65}
                                            pauseDuration={1800}
                                            textColors={["var(--cf-text)"]}
                                        />
                                    </div>
                                </div>

                                {/* Columna derecha: botones (4 columnas en lg) */}
                                <div className="col-12 col-lg-4 d-flex flex-column align-items-lg-end align-items-start">
                                    <button
                                        type="button"
                                        className="math-help-button mb-1 lab-help-btn"
                                        onClick={() => setShowHistory(true)}
                                    >
                                        ¿Sabes de dónde viene el OTP?
                                    </button>
                                    <button
                                        type="button"
                                        className="math-help-button lab-help-btn"
                                        onClick={() => setShowXorHelp(true)}
                                    >
                                        ¿XOR? ¿Qué es?
                                    </button>
                                </div>
                            </header>

                            <div className="example-controls">
                                <label>
                                    Mensaje M (binario)
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={binaryPlain}
                                        onChange={(e) =>
                                            setBinaryPlain(cleanBinary(e.target.value))
                                        }
                                        placeholder="Ej: 101010"
                                    />
                                </label>
                                <label>
                                    Clave K (binaria)
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={binaryKey}
                                        onChange={(e) =>
                                            setBinaryKey(cleanBinary(e.target.value))
                                        }
                                        placeholder="Ej: 110011"
                                    />
                                </label>
                            </div>

                            <div className="example-results">
                                <div>
                                    <span className="example-label">M</span>
                                    <ScrambledText
                                        radius={10}
                                        duration={5}
                                        speed={0.1}
                                        className="p"
                                    >
                                        {cleanBinary(binaryPlain)}
                                    </ScrambledText>
                                </div>
                                <div>
                                    <span className="example-label">K</span>
                                    <ScrambledText
                                        radius={10}
                                        duration={5}
                                        speed={0.1}
                                        className="p"
                                    >
                                        {cleanBinary(binaryKey)}
                                    </ScrambledText>
                                </div>
                                <div>
                                    <span className="example-label">C = M ⊕ K</span>
                                    <ScrambledText
                                        radius={10}
                                        duration={5}
                                        speed={0.1}
                                        className="p"
                                    >
                                        {binaryCipher}
                                    </ScrambledText>
                                </div>
                            </div>

                            <div className="game-tip">
                                <TextType
                                    text="Prueba a cambiar solo un bit de M o de K y observa cómo cambia C en esa posición. En OTP cada bit viaja con su propia parte de la clave."
                                    as="p"
                                    typingSpeed={25}
                                    deletingSpeed={65}
                                    pauseDuration={1800}
                                    textColors={["var(--cf-text)"]}
                                />
                            </div>

                            <img
                                src={Study}
                                alt="CypherFox estudiando bits y XOR"
                                className="math-mascot"
                            />
                        </div>

                        {/* Pizarra matemática binaria */}
                        <aside className="card-free math-card" ref={mathBinaryRef}>
                            <h2>
                                <DecryptedText
                                    text="Regla matemática en binario"
                                    className="h2"
                                    encryptedClassName="h2 text-encrypted"
                                    speed={120}
                                    maxIterations={60}
                                />
                            </h2>

                            <p>
                                Primero modelamos el mensaje, la clave y el cifrado como <strong>vectores de bits</strong>:
                            </p>

                            <BlockMath math={"M = (m_1, \\dots, m_n), \\\\ K = (k_1, \\dots, k_n), \\\\ C = (c_1, \\dots, c_n)"} />

                            <p>
                                Cada bit toma valores en <InlineMath math="\{0,1\}" /> y ciframos posición por posición usando XOR:
                            </p>

                            <BlockMath math={"c_i = m_i \\oplus k_i"} />

                            <p>
                                Para descifrar hacemos lo mismo, porque XOR es su propia inversa:
                            </p>

                            <BlockMath math={"m_i = c_i \\oplus k_i"} />

                            <p className="math-explanation">
                                Si la clave K es aleatoria, tan larga como M y se usa solo una vez,
                                el resultado es un cifrado con <strong>seguridad perfecta</strong>.
                            </p>
                        </aside>
                    </div>
                </section>

                {/* FRANJA 2: OTP en alfabeto completo */}
                <section className="otp-band band-alpha">
                    <div className="band-grid">
                        {/* Pizarra matemática alfabética */}
                        <div className="card-free math-card" ref={mathAlphaRef}>
                            <div className="math-header-row">
                                <div className="math-header-text">
                                    <h2>
                                        <DecryptedText
                                            text="Del binario al alfabeto"
                                            className="h2"
                                            encryptedClassName="h2 text-encrypted"
                                            speed={120}
                                            maxIterations={60}
                                        />
                                    </h2>
                                </div>
                                <button
                                    type="button"
                                    className="math-help-button"
                                    onClick={() => setShowAlphaHelp(true)}
                                >
                                    ¿mod {n}?
                                </button>
                            </div>

                            <p>
                                Ahora usamos el alfabeto{" "}
                                <InlineMath math="\Sigma = \{A,\dots,Z\}" />. A cada letra le asignamos un número:
                            </p>

                            <ul className="math-list">
                                <li>A → 0, B → 1, C → 2, …, Z → {n - 1}.</li>
                                <li>
                                    El mensaje en claro es una secuencia{" "}
                                    <InlineMath math={"(m_1, \\dots, m_n)"} /> de números entre 0 y {n - 1}.
                                </li>
                                <li>
                                    La clave K es otra secuencia{" "}
                                    <InlineMath math={"(k_1, \\dots, k_n)"} /> de la misma longitud.
                                </li>
                            </ul>

                            <p>
                                Ciframos sumando la clave y aplicando módulo {n} en cada posición:
                            </p>

                            <BlockMath math={`c_i = (m_i + k_i) \\bmod ${n}`} />

                            <p>
                                Para descifrar restamos la misma clave y volvemos a aplicar el
                                módulo:
                            </p>

                            <BlockMath math={`m_i = (c_i - k_i) \\bmod ${n}`} />

                            <p className="math-explanation">
                                En esencia, el OTP sobre letras es el mismo juego que en binario:
                                una suma en un grupo finito (aquí, el grupo cíclico de tamaño {n}).
                            </p>

                            <img
                                src={Study}
                                alt="CypherFox analizando el One-Time Pad alfabético"
                                className="math-mascot"
                            />
                        </div>

                        {/* Juego alfabético */}
                        <div className="card-free game-card" ref={gameAlphaRef}>
                            <h2>
                                <DecryptedText
                                    text="Juega con el OTP en letras"
                                    className="h2"
                                    encryptedClassName="h2 text-encrypted"
                                    speed={120}
                                    maxIterations={60}
                                />
                            </h2>
                            <TextType
                                text="Escribe un mensaje con letras y una clave de la misma longitud. Cada letra de la clave actúa como un pequeño desplazamiento diferente, mucho más difícil de adivinar que un único k fijo como en César."
                                as="p"
                                typingSpeed={25}
                                deletingSpeed={65}
                                pauseDuration={1800}
                                textColors={["var(--cf-text)"]}
                            />

                            <div className="example-controls">
                                <label>
                                    Mensaje en claro
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={alphaPlain}
                                        onChange={(e) => setAlphaPlain(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Clave (misma longitud)
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={alphaKey}
                                        onChange={(e) => setAlphaKey(e.target.value)}
                                    />
                                </label>
                            </div>

                            <div className="example-results">
                                <div>
                                    <span className="example-label">Claro</span>
                                    <ScrambledText
                                        radius={10}
                                        duration={5}
                                        speed={0.1}
                                        className="p"
                                    >
                                        {alphaPlain.toUpperCase()}
                                    </ScrambledText>
                                </div>
                                <div>
                                    <span className="example-label">Clave</span>
                                    <ScrambledText
                                        radius={10}
                                        duration={5}
                                        speed={0.1}
                                        className="p"
                                    >
                                        {alphaKey.toUpperCase()}
                                    </ScrambledText>
                                </div>
                                <div>
                                    <span className="example-label">Cifrado</span>
                                    <ScrambledText
                                        radius={10}
                                        duration={5}
                                        speed={0.1}
                                        className="p"
                                    >
                                        {alphaCipher}
                                    </ScrambledText>
                                </div>
                            </div>

                            <div className="game-tip">
                                <TextType
                                    text="Imagina que la clave es totalmente aleatoria y tan larga como el mensaje. Incluso con muchos recursos de cómputo, no hay un atajo mejor que adivinar todos los bits/letras de K."
                                    as="p"
                                    typingSpeed={25}
                                    deletingSpeed={65}
                                    pauseDuration={1800}
                                    textColors={["var(--cf-text)"]}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* MODAL XOR */}
                {showXorHelp && (
                    <div
                        className="modal-backdrop"
                        onClick={() => setShowXorHelp(false)}
                    >
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header-with-fox">
                                <h3>¿Qué hace exactamente XOR?</h3>
                                <img
                                    src={Help}
                                    alt="CypherFox confundido con un signo de interrogación"
                                    className="modal-mascot"
                                />
                            </div>

                            <p>
                                La operación XOR entre bits se escribe <InlineMath math="\oplus" /> y se comporta así:
                            </p>

                            <BlockMath math={"0 \\oplus 0 = 0,\\\\ 0 \\oplus 1 = 1,\\\\ 1 \\oplus 0 = 1,\\\\ 1 \\oplus 1 = 0."} />

                            <p>
                                También puedes verla como una <strong>suma módulo 2</strong>. Si sumas dos bits y el resultado
                                es 2, se convierte en 0:
                            </p>

                            <BlockMath math={"a \\oplus b = (a + b) \\bmod 2"} />

                            <p>
                                En el One-Time Pad, cifrar y descifrar usan la misma operación:
                            </p>

                            <BlockMath math={"C = M \\oplus K,\\\\ M = C \\oplus K."} />

                            <p>
                                Gracias a que <InlineMath math="k \oplus k = 0" /> para cualquier
                                bit <InlineMath math="k" />, al aplicar XOR con la misma clave dos
                                veces, la cancelamos y recuperamos el mensaje original.
                            </p>

                            <button
                                type="button"
                                className="close-button"
                                onClick={() => setShowXorHelp(false)}
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                )}

                {/* MODAL mod 26 */}
                {showAlphaHelp && (
                    <div
                        className="modal-backdrop"
                        onClick={() => setShowAlphaHelp(false)}
                    >
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header-with-fox">
                                <h3>Recordatorio: ¿qué es mod {n}?</h3>
                                <img
                                    src={Help}
                                    alt="CypherFox recordando el módulo"
                                    className="modal-mascot"
                                />
                            </div>

                            <p>
                                Trabajar módulo {n} es como contar en un reloj de {n} horas. Cuando
                                llegas a {n}, vuelves a 0.
                            </p>

                            <p>
                                Si A → 0, B → 1, …, Z → {n - 1}, al cifrar una letra sumamos el
                                valor de la clave y, si nos pasamos de {n - 1}, volvemos a empezar
                                desde 0:
                            </p>

                            <BlockMath math={`c_i = (m_i + k_i) \\bmod ${n}`} />

                            <p>
                                Por ejemplo, si Z → {n - 1} y sumamos 3:
                            </p>

                            <BlockMath math={`${n - 1} + 3 = ${n + 2} \\equiv 2 \\pmod{${n}}`} />

                            <p>
                                Eso significa que Z cifrada con 3 se convierte en la letra con
                                número 2, es decir, C.
                            </p>

                            <button
                                type="button"
                                className="close-button"
                                onClick={() => setShowAlphaHelp(false)}
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                )}

                {/* MODAL Historia OTP */}
                {showHistory && (
                    <div
                        className="modal-backdrop"
                        onClick={() => setShowHistory(false)}
                    >
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header-with-fox">
                                <h3>Historia del One-Time Pad</h3>
                                <img
                                    src={Help}
                                    alt="CypherFox contando la historia del One-Time Pad"
                                    className="modal-mascot"
                                />
                            </div>

                            <p>
                                A comienzos del siglo XX, el ingeniero{" "}
                                <strong>Gilbert Vernam</strong>, que trabajaba en AT&amp;T,
                                propuso un sistema para cifrar mensajes telegráficos combinando el
                                texto claro con una cinta de clave mediante suma módulo 2 (lo que
                                hoy vemos como XOR en binario).
                            </p>

                            <p>
                                Poco después, el mayor <strong>Joseph Mauborgne</strong>, del
                                ejército de Estados Unidos, dio el paso clave: la cinta de clave
                                debía ser <strong>completamente aleatoria</strong>,{" "}
                                <strong>tan larga como el mensaje</strong> y{" "}
                                <strong>usarse una sola vez</strong>. Esa idea de la “libreta de un
                                solo uso” es lo que convierte el sistema en el{" "}
                                <em>One-Time Pad</em> moderno.
                            </p>

                            <p>
                                Durante la <strong>Segunda Guerra Mundial</strong> y la{" "}
                                <strong>Guerra Fría</strong>, distintos gobiernos y servicios de
                                inteligencia usaron libretas físicas de clave de un solo uso para
                                comunicaciones diplomáticas y militares muy sensibles. Cada hoja se
                                destruía justo después de cifrar o descifrar el mensaje.
                            </p>

                            <p>
                                En 1949, <strong>Claude Shannon</strong>, padre de la teoría de la
                                información, demostró que, si se cumplen esas condiciones (clave
                                aleatoria, tan larga como el mensaje y nunca reutilizada), el
                                One-Time Pad tiene <strong>seguridad perfecta</strong>: el cifrado
                                no revela ninguna información sobre el mensaje original.
                            </p>

                            <p>
                                El problema es logístico: hay que generar y repartir cantidades
                                enormes de clave secreta y asegurarse de no reutilizarla jamás. Por
                                eso, aunque es un “cifrado perfecto” en teoría, en la práctica se
                                reserva para casos muy especiales y se usan otros métodos más
                                cómodos para el día a día.
                            </p>

                            <button
                                type="button"
                                className="close-button"
                                onClick={() => setShowHistory(false)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OneTimePad;
import { useState, useRef, useEffect } from "react";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";
import "./Vigenere.css";

import WelcomeGif from "../../../assets/welcome.gif";
import StudyGif from "../../../assets/study.gif";
import HelpGif from "../../../assets/help.gif";

import DecryptedText from "../../../components/text/DecryptedText";
import TextType from "../../../components/text/TextType";
import ScrambledText from "../../../components/text/ScrambleText";

import { gsap } from "gsap";

/* =========================================================
   ENCRYPTION LOGIC
   ========================================================= */
function find_letter(letter) {
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(letter);
}
function get_letter(index) {
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[index];
}
function vigenere_encrypt(mensaje, clave) {
    const len_clave = clave.length;
    let counter = 0;
    let cifrado = "";
    for (const letra of mensaje) {
        if (letra !== " ") {
            cifrado += get_letter(
                (find_letter(letra) + find_letter(clave[counter % len_clave])) % 26
            );
            counter++;
        } else {
            cifrado += " ";
        }
    }
    return cifrado;
}
function vigenere_decrypt(cifrado, clave) {
    const len_clave = clave.length;
    let counter = 0;
    let mensaje = "";
    for (const letra of cifrado) {
        if (letra !== " ") {
            mensaje += get_letter(
                ((find_letter(letra) - find_letter(clave[counter % len_clave])) % 26 +
                    26) %
                26
            );
            counter++;
        } else {
            mensaje += " ";
        }
    }
    return mensaje;
}

/* =========================================================
   COMPONENT
   ========================================================= */
function Vigenere() {
    /* ── STATE ── */
    const [plainText, setPlainText] = useState("HOLA MUNDO");
    const [keyword, setKeyword] = useState("CLAVE");
    const [showMathHelp, setShowMathHelp] = useState(false);
    const [showHistoryHelp, setShowHistoryHelp] = useState(false);
    const [showVigenereHelp, setShowVigenereHelp] = useState(false);
    const [heroKeyIndex, setHeroKeyIndex] = useState(0);

    /* ── REFS ── */
    const heroRef = useRef(null);
    const heroCircleRef = useRef(null);
    const heroMascotRef = useRef(null);
    const bandLabRef = useRef(null);
    const mathCardRef = useRef(null);
    const gameCardRef = useRef(null);

    /* ── COMPUTED ── */
    const safeKeyword =
        keyword.toUpperCase().replace(/[^A-Z]/g, "") || "A";
    const safePlain = plainText.toUpperCase().replace(/[^A-Z ]/g, "");
    const encryptedText = vigenere_encrypt(safePlain, safeKeyword);
    const decryptedText = vigenere_decrypt(encryptedText, safeKeyword);

    /* ── KEY CYCLING DATA ── */
    const cyclingData = (() => {
        let counter = 0;
        return safePlain.split("").map((letra) => {
            if (letra === " ") return { plain: " ", key: " ", cipher: " " };
            const keyLetter = safeKeyword[counter % safeKeyword.length];
            const cipherLetter = get_letter(
                (find_letter(letra) + find_letter(keyLetter)) % 26
            );
            counter++;
            return { plain: letra, key: keyLetter, cipher: cipherLetter };
        });
    })();

    /* ── CYCLING KEY DISPLAYED IN GAME CARD ── */
    const cyclingKeyDisplay = safePlain
        .split("")
        .map((ch, i) => {
            if (ch === " ") return " ";
            let c = 0;
            for (let j = 0; j < i; j++) if (safePlain[j] !== " ") c++;
            return safeKeyword[c % safeKeyword.length];
        })
        .join("");

    /* ── HERO CIRCLE INTERVAL ── */
    useEffect(() => {
        const interval = setInterval(() => {
            setHeroKeyIndex((prev) => (prev + 1) % safeKeyword.length);
        }, 900);
        return () => clearInterval(interval);
    }, [safeKeyword]);

    /* ── GSAP ANIMATION ── */
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap
                .timeline()
                .from(heroRef.current, {
                    opacity: 0,
                    y: 20,
                    duration: 0.6,
                    ease: "power2.out",
                })
                .from(
                    heroCircleRef.current,
                    { opacity: 0, scale: 0.85, duration: 0.5, ease: "back.out(1.4)" },
                    "-=0.3"
                )
                .from(
                    heroMascotRef.current,
                    { opacity: 0, x: 18, duration: 0.5, ease: "power2.out" },
                    "-=0.3"
                )
                .from(
                    bandLabRef.current,
                    { opacity: 0, y: 16, duration: 0.55, ease: "power2.out" },
                    "-=0.1"
                )
                .from(
                    mathCardRef.current,
                    { opacity: 0, y: 16, duration: 0.5, ease: "power2.out" },
                    "-=0.2"
                )
                .from(
                    gameCardRef.current,
                    { opacity: 0, y: 16, duration: 0.5, ease: "power2.out" },
                    "-=0.3"
                );
        });
        return () => ctx.revert();
    }, []);

    /* ── MINI TABLEAU (8×8) ── */
    const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const TABLEAU_SIZE = 8;
    const tableauRows = Array.from({ length: TABLEAU_SIZE }, (_, rowIdx) =>
        Array.from({ length: TABLEAU_SIZE }, (_, colIdx) =>
            ALPHABET[(rowIdx + colIdx) % 26]
        )
    );

    const firstNonSpace = cyclingData.find((d) => d.plain !== " ");
    const activeRow =
        firstNonSpace ? find_letter(firstNonSpace.key) % TABLEAU_SIZE : -1;
    const activeCol =
        firstNonSpace ? find_letter(firstNonSpace.plain) % TABLEAU_SIZE : -1;

    /* ── RENDER ── */
    return (
        <div className="vigenere-page">
            <div className="container vigenere-shell">

                {/* ════════════════════════════════════════
            HERO
        ════════════════════════════════════════ */}
                <section className="vigenere-hero" ref={heroRef}>
                    <div className="hero-copy">
                        <span className="hero-badge">Lección · Cifrado polialfabético</span>
                        <h1 className="hero-copy-tittle">
                            <DecryptedText text="Cifrado de" />{" "}
                            <span className="hero-copy-tittle-encrypted">
                                <DecryptedText text="Vigenère" />
                            </span>
                        </h1>
                        <TextType
                            as="p"
                            text="Una clave que se repite, múltiples alfabetos y mucha más resistencia que César. Descubre cómo una palabra clave transforma cada letra de forma diferente."
                            typingSpeed={25}
                            deletingSpeed={65}
                            pauseDuration={1800}
                            textColors={["var(--cf-text)"]}
                        />
                    </div>

                    <div className="hero-visual">
                        <img
                            ref={heroMascotRef}
                            src={WelcomeGif}
                            alt="Mascota CypherFox"
                            className="hero-mascot"
                        />
                        <div ref={heroCircleRef} className="hero-circle hero-circle-main">
                            <div className="hero-circle-inner">
                                <div className="k-label">
                                    K<sub>i</sub>
                                </div>
                                <div className="k-value">{safeKeyword[heroKeyIndex]}</div>
                            </div>
                        </div>
                        <div className="hero-circle hero-circle-small hero-circle-1" />
                        <div className="hero-circle hero-circle-small hero-circle-2" />
                    </div>
                </section>

                {/* ════════════════════════════════════════
            BANDA 1 — LABORATORIO + HISTORIA FLOTANTE
        ════════════════════════════════════════ */}
                <section className="vigenere-band band-lab">
                    <div className="band-lab-inner" ref={bandLabRef}>
                        <div className="lab-core">
                            <div className="lab-header-row">
                                <div>
                                    <h2>
                                        <DecryptedText text="El tablero de Vigenère" />
                                    </h2>
                                    <p className="lab-subtitle">
                                        La <strong>Tabula Recta</strong> es una tabla 26×26 donde cada fila
                                        es el alfabeto desplazado una posición. La fila de la letra de la
                                        clave y la columna de la letra del mensaje indican la letra cifrada.
                                        Aquí se muestra una versión reducida (A–H) con la intersección activa
                                        resaltada según tu mensaje y clave actuales.
                                    </p>
                                </div>
                            </div>

                            {/* Mini Vigenère Tableau */}
                            <div className="vigenere-tableau-wrapper">
                                <table className="vigenere-tableau">
                                    <thead>
                                        <tr>
                                            <th className="tableau-header-cell">K \ M</th>
                                            {ALPHABET.slice(0, TABLEAU_SIZE)
                                                .split("")
                                                .map((col) => (
                                                    <th key={col} className="tableau-header-cell">
                                                        {col}
                                                    </th>
                                                ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableauRows.map((row, rowIdx) => (
                                            <tr key={rowIdx}>
                                                <td className="tableau-header-cell">
                                                    {ALPHABET[rowIdx]}
                                                </td>
                                                {row.map((cell, colIdx) => {
                                                    const isActiveRow = rowIdx === activeRow;
                                                    const isActiveCol = colIdx === activeCol;
                                                    const isHighlight = isActiveRow && isActiveCol;
                                                    let cellClass = "tableau-cell";
                                                    if (isHighlight)
                                                        cellClass += " tableau-cell-highlight";
                                                    else if (isActiveRow)
                                                        cellClass += " tableau-cell-active-row";
                                                    else if (isActiveCol)
                                                        cellClass += " tableau-cell-active-col";
                                                    return (
                                                        <td key={colIdx} className={cellClass}>
                                                            {cell}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Key Cycling Visualization */}
                            <div className="key-cycling-display">
                                <div className="key-row">
                                    <span className="key-row-label">Mensaje</span>
                                    {cyclingData.map((d, i) =>
                                        d.plain === " " ? (
                                            <div key={i} className="key-letter-box space">
                                                ·
                                            </div>
                                        ) : (
                                            <div key={i} className="key-letter-box plain">
                                                {d.plain}
                                            </div>
                                        )
                                    )}
                                </div>
                                <div className="key-row">
                                    <span className="key-row-label">Clave</span>
                                    {cyclingData.map((d, i) =>
                                        d.key === " " ? (
                                            <div key={i} className="key-letter-box space">
                                                ·
                                            </div>
                                        ) : (
                                            <div key={i} className="key-letter-box key">
                                                {d.key}
                                            </div>
                                        )
                                    )}
                                </div>
                                <div className="key-row">
                                    <span className="key-row-label">Cifrado</span>
                                    {cyclingData.map((d, i) =>
                                        d.cipher === " " ? (
                                            <div key={i} className="key-letter-box space">
                                                ·
                                            </div>
                                        ) : (
                                            <div key={i} className="key-letter-box cipher">
                                                {d.cipher}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Historia Flotante */}
                        <aside className="history-floating">
                            <h3>🔐 La Máquina Enigma</h3>
                            <p>
                                El cifrado de Vigenère fue considerado "indescifrable" durante siglos.
                                Su principio polialfabético inspiró directamente a la Máquina Enigma,
                                utilizada por la Alemania Nazi en la Segunda Guerra Mundial.
                            </p>
                            <button
                                className="math-help-button"
                                onClick={() => setShowHistoryHelp(true)}
                            >
                                Leer más →
                            </button>
                        </aside>
                    </div>
                </section>

                {/* ════════════════════════════════════════
            BANDA 2 — PIZARRA MATEMÁTICA + JUEGO
        ════════════════════════════════════════ */}
                <section className="vigenere-band band-bottom">
                    <div className="band-grid">

                        {/* ── MATH CARD ── */}
                        <div className="card-free math-card" ref={mathCardRef}>
                            <div className="math-header-row">
                                <div className="math-header-text">
                                    <h2>La regla matemática</h2>
                                </div>
                                <button
                                    className="math-help-button"
                                    onClick={() => setShowVigenereHelp(true)}
                                >
                                    ¿Tabula Recta?
                                </button>
                                <button
                                    className="math-help-button"
                                    onClick={() => setShowMathHelp(true)}
                                >
                                    ¿mod 26?
                                </button>
                            </div>

                            <p className="math-explanation">
                                Asignamos números a cada letra: A = 0, B = 1, …, Z = 25.
                            </p>

                            <p style={{ fontSize: "0.9rem", marginBottom: "0.6rem" }}>
                                La clave{" "}
                                <InlineMath math="K = (k_1, k_2, \ldots, k_m)" /> se repite
                                cíclicamente sobre el mensaje. El índice de la clave que se aplica
                                a cada letra es <InlineMath math="k_{i \bmod |K|}" />, donde{" "}
                                <InlineMath math="|K|" /> es la longitud de la clave.
                            </p>

                            <p className="math-explanation">Cifrado:</p>
                            <BlockMath math="c_i = (m_i + k_{i \bmod |K|}) \bmod 26" />

                            <p className="math-explanation">Descifrado:</p>
                            <BlockMath math="m_i = (c_i - k_{i \bmod |K|} + 26) \bmod 26" />

                            <p style={{ fontSize: "0.9rem", marginTop: "0.8rem" }}>
                                A diferencia del <strong>Cifrado César</strong> (que usa un único
                                desplazamiento fijo), Vigenère aplica un desplazamiento{" "}
                                <em>diferente</em> en cada posición según la letra correspondiente
                                de la clave. Esto se denomina <strong>cifrado polialfabético</strong>{" "}
                                y hace que el <em>análisis de frecuencias</em> simple sea ineficaz:
                                la misma letra del mensaje puede producir letras cifradas distintas.
                            </p>

                            <ul className="math-list">
                                <li>
                                    <strong>César:</strong> desplazamiento constante → 1 único
                                    alfabeto cifrado.
                                </li>
                                <li>
                                    <strong>Vigenère:</strong> desplazamiento variable → tantos
                                    alfabetos como longitud de clave.
                                </li>
                                <li>
                                    Mayor longitud de clave → mayor dificultad para el criptoanálisis.
                                </li>
                                <li>
                                    Si la clave fuera tan larga como el mensaje y completamente aleatoria,
                                    se convertiría en un <strong>One-Time Pad</strong> —
                                    teóricamente irrompible.
                                </li>
                            </ul>

                            <img
                                src={StudyGif}
                                alt="Mascota estudiando"
                                className="math-mascot"
                            />
                        </div>

                        {/* ── GAME CARD ── */}
                        <div className="card-free game-card" ref={gameCardRef}>
                            <h2>
                                <DecryptedText text="Cifra tu mensaje secreto" />
                            </h2>
                            <TextType
                                as="p"
                                texts="La misma letra del mensaje puede cifrarse de forma distinta dependiendo de su posición. ¡Pruébalo tú mismo!"
                                typingSpeed={25}
                                deletingSpeed={65}
                                pauseDuration={1800}
                                textColors={["var(--cf-text)"]}
                            />

                            <div className="example-controls">
                                <label>
                                    Texto en claro
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={plainText}
                                        onChange={(e) =>
                                            setPlainText(
                                                e.target.value.toUpperCase().replace(/[^A-Z ]/g, "")
                                            )
                                        }
                                        placeholder="Ej. HOLA MUNDO"
                                        maxLength={30}
                                    />
                                </label>
                                <label>
                                    Palabra clave
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={keyword}
                                        onChange={(e) =>
                                            setKeyword(
                                                e.target.value.toUpperCase().replace(/[^A-Z]/g, "")
                                            )
                                        }
                                        placeholder="Ej. CLAVE"
                                        maxLength={16}
                                    />
                                </label>
                            </div>

                            <div className="example-results">
                                <div>
                                    <span className="example-label">Claro</span>
                                    <p>{safePlain || "—"}</p>
                                </div>
                                <div>
                                    <span className="example-label">Clave (cíclica)</span>
                                    <p style={{ color: "var(--cf-orange)" }}>
                                        {cyclingKeyDisplay || "—"}
                                    </p>
                                </div>
                                <div>
                                    <span className="example-label">Cifrado</span>
                                    <ScrambledText
                                        radius={10}
                                        duration={5}
                                        speed={0.1}
                                        className="p"
                                    >
                                        {encryptedText || "—"}
                                    </ScrambledText>
                                </div>
                                <div>
                                    <span className="example-label">Descifrado</span>
                                    <ScrambledText
                                        radius={10}
                                        duration={5}
                                        speed={0.1}
                                        className="p"
                                    >
                                        {decryptedText || "—"}
                                    </ScrambledText>
                                </div>
                            </div>

                            <TextType
                                as="p"
                                className="game-tip"
                                texts="Fíjate cómo la misma letra del mensaje puede cifrarse de forma distinta dependiendo de su posición. Eso hace el análisis de frecuencias mucho más difícil."
                                typingSpeed={22}
                                deletingSpeed={65}
                                pauseDuration={1800}
                                textColors={["var(--cf-text)"]}
                            />
                        </div>

                    </div>
                </section>

            </div>

            {/* ════════════════════════════════════════
          MODAL 1 — Historia Enigma
      ════════════════════════════════════════ */}
            {showHistoryHelp && (
                <div
                    className="modal-backdrop"
                    onClick={() => setShowHistoryHelp(false)}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header-with-fox">
                            <h3>🔐 La Máquina Enigma y la herencia de Vigenère</h3>
                            <img
                                src={HelpGif}
                                alt="Mascota ayuda"
                                className="modal-mascot"
                            />
                        </div>

                        <p>
                            El cifrado de Vigenère fue inventado en el siglo XVI por{" "}
                            <strong>Giovan Battista Bellaso</strong> (aunque históricamente se
                            atribuyó durante mucho tiempo a Blaise de Vigenère). Durante casi
                            tres siglos fue conocido como{" "}
                            <em>«le chiffre indéchiffrable»</em> — el cifrado indescifrable —
                            hasta que <strong>Charles Babbage</strong> y{" "}
                            <strong>Friedrich Kasiski</strong> lo quebraron de forma
                            independiente en el siglo XIX mediante el análisis del período de
                            la clave.
                        </p>

                        <h4 style={{ marginTop: "1rem" }}>⚙️ La Máquina Enigma</h4>
                        <p>
                            La <strong>Máquina Enigma</strong>, utilizada por la Alemania Nazi
                            durante la Segunda Guerra Mundial, es la evolución mecánico-eléctrica
                            del principio polialfabético de Vigenère. Sus <em>rotores</em>{" "}
                            cambiaban el alfabeto de sustitución con cada pulsación de tecla,
                            funcionando como una clave que se renovaba automáticamente en cada
                            letra — similar a Vigenère, pero con combinaciones electromecánicas
                            prácticamente inagotables.
                        </p>
                        <p>
                            Las configuraciones de Enigma incluían la elección y orden de los
                            rotores, sus posiciones iniciales y un tablero de clavijas (
                            <em>Steckerbrett</em>), generando más de{" "}
                            <strong>
                                10<sup>23</sup> combinaciones
                            </strong>{" "}
                            posibles al inicio de cada jornada.
                        </p>

                        <h4 style={{ marginTop: "1rem" }}>🧠 Alan Turing y Bletchley Park</h4>
                        <p>
                            <strong>Alan Turing</strong> y su equipo en{" "}
                            <em>Bletchley Park</em> lograron descifrar Enigma construyendo la{" "}
                            <strong>Bombe</strong>, una máquina electromecánica que explotaba
                            dos debilidades fundamentales del sistema:
                        </p>
                        <ul style={{ paddingLeft: "1.2rem", fontSize: "0.9rem" }}>
                            <li>
                                <strong>Cribs (texto conocido):</strong> fragmentos de texto en
                                claro predecible — como saludos militares fijos o partes
                                meteorológicos diarios — que permitían probar y descartar
                                configuraciones en masa.
                            </li>
                            <li>
                                <strong>Reflexión:</strong> por diseño, Enigma nunca cifraba
                                una letra como sí misma, lo que eliminaba inmediatamente millones
                                de posibles configuraciones.
                            </li>
                        </ul>
                        <p>
                            Se estima que descifrar Enigma acortó la guerra entre{" "}
                            <strong>2 y 4 años</strong> y salvó millones de vidas. El trabajo
                            de Turing también sentó las bases teóricas de la computación moderna
                            y de lo que hoy conocemos como <em>Inteligencia Artificial</em>.
                        </p>

                        <h4 style={{ marginTop: "1rem" }}>🎬 The Imitation Game (2014)</h4>
                        <p>
                            La película <em>The Imitation Game</em> (dir.{" "}
                            <strong>Morten Tyldum</strong>) relata la historia de Alan Turing
                            durante la guerra, centrada en el proyecto de descifrado de Enigma.
                            Protagonizada por{" "}
                            <strong>Benedict Cumberbatch</strong> como Alan Turing y{" "}
                            <strong>Keira Knightley</strong> como Joan Clarke — matemática y
                            criptoanalista clave del equipo —, la película fue nominada a{" "}
                            <strong>8 Premios Óscar</strong> y ganó el de{" "}
                            <strong>Mejor Guión Adaptado</strong>. Aunque dramatiza ciertos
                            hechos históricos, representa una introducción accesible y
                            emocionante a la historia de la criptografía moderna y al
                            nacimiento de la computación como disciplina.
                        </p>

                        <button
                            className="close-button"
                            onClick={() => setShowHistoryHelp(false)}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════════
          MODAL 2 — mod 26
      ════════════════════════════════════════ */}
            {showMathHelp && (
                <div
                    className="modal-backdrop"
                    onClick={() => setShowMathHelp(false)}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header-with-fox">
                            <h3>¿Qué significa mod 26?</h3>
                            <img
                                src={HelpGif}
                                alt="Mascota ayuda"
                                className="modal-mascot"
                            />
                        </div>
                        <p>
                            La operación <InlineMath math="\bmod\, 26" /> devuelve el{" "}
                            <strong>resto de la división</strong> entre 26. Imagina un reloj,
                            pero en lugar de 12 horas tiene <strong>26 posiciones</strong> —
                            una por cada letra del alfabeto.
                        </p>
                        <p>
                            Cuando al sumar dos letras el resultado supera la Z (índice 25),
                            simplemente "damos la vuelta" al abecedario y comenzamos de nuevo
                            desde la A (índice 0). Nunca salimos del rango 0–25.
                        </p>
                        <p>
                            Ejemplo: letra del mensaje{" "}
                            <InlineMath math="T = 19" />, letra de la clave{" "}
                            <InlineMath math="H = 7" />:
                        </p>
                        <BlockMath math="(19 + 7) \bmod 26 = 26 \bmod 26 = 0 = A" />
                        <p>
                            Para el descifrado, si el resultado fuera negativo, sumamos 26 para
                            mantenernos dentro del rango:
                        </p>
                        <BlockMath math="(0 - 7 + 26) \bmod 26 = 19 = T \checkmark" />
                        <p style={{ fontSize: "0.88rem", color: "rgba(249,244,244,0.75)" }}>
                            Por eso en la función de descifrado siempre sumamos +26 antes del
                            módulo, para evitar restos negativos en JavaScript (y en Python).
                        </p>
                        <button
                            className="close-button"
                            onClick={() => setShowMathHelp(false)}
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════════
          MODAL 3 — Tabula Recta
      ════════════════════════════════════════ */}
            {showVigenereHelp && (
                <div
                    className="modal-backdrop"
                    onClick={() => setShowVigenereHelp(false)}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header-with-fox">
                            <h3>¿Qué es la Tabula Recta?</h3>
                            <img
                                src={HelpGif}
                                alt="Mascota ayuda"
                                className="modal-mascot"
                            />
                        </div>
                        <p>
                            La <strong>Tabula Recta</strong> es una tabla de 26 × 26 letras
                            ideada por el monje y criptógrafo alemán{" "}
                            <strong>Johannes Trithemius</strong> en el siglo XV. Cada fila{" "}
                            <InlineMath math="i" /> contiene el alfabeto desplazado{" "}
                            <InlineMath math="i" /> posiciones hacia la izquierda:
                        </p>
                        <BlockMath math="\text{Tabla}[i][j] = (i + j) \bmod 26" />
                        <p>Para cifrar una letra del mensaje con Vigenère:</p>
                        <ul style={{ paddingLeft: "1.2rem", fontSize: "0.9rem" }}>
                            <li>
                                Localiza la <strong>fila</strong> cuyo encabezado coincide con
                                la letra de la{" "}
                                <span style={{ color: "var(--cf-orange)" }}>clave</span>.
                            </li>
                            <li>
                                Localiza la <strong>columna</strong> cuyo encabezado coincide
                                con la letra del{" "}
                                <span style={{ color: "var(--cf-text)" }}>mensaje</span>.
                            </li>
                            <li>
                                La celda en su{" "}
                                <strong>intersección</strong> es la{" "}
                                <span style={{ color: "#3ecf80" }}>letra cifrada</span>.
                            </li>
                        </ul>
                        <p>
                            En el laboratorio de arriba puedes ver la fila activa resaltada
                            en{" "}
                            <span style={{ color: "var(--cf-orange)" }}>naranja</span>, la
                            columna activa en{" "}
                            <span style={{ color: "#3ecf80" }}>verde</span> y la celda
                            resultante en{" "}
                            <strong style={{ color: "var(--cf-orange)" }}>
                                naranja brillante
                            </strong>
                            . Los valores se actualizan en tiempo real según tu mensaje y tu
                            clave.
                        </p>
                        <button
                            className="close-button"
                            onClick={() => setShowVigenereHelp(false)}
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Vigenere;
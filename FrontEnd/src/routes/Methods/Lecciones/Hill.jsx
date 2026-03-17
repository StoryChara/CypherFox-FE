// routes/Methods/Lecciones/Hill.jsx
import { useState, useRef, useEffect } from "react";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";
import "./Hill.css";
import WelcomeGif from "../../../assets/welcome.gif";
import StudyGif from "../../../assets/study.gif";
import HelpGif from "../../../assets/help.gif";
import DecryptedText from "../../../components/text/DecryptedText";
import TextType from "../../../components/text/TextType";
import ScrambledText from "../../../components/text/ScrambleText";
import { gsap } from "gsap";

/* =========================================================
   CIPHER LOGIC  (tu código Python traducido a JS)
   ========================================================= */
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function findLetter(letter) { return ALPHA.indexOf(letter.toUpperCase()); }
function getLetter(index) { return ALPHA[((index % 26) + 26) % 26]; }

function padMessage(msg) {
    const rem = (4 - (msg.length % 4)) % 4;
    return msg + "X".repeat(rem);
}

function textToMatrix(text) {
    return [
        [findLetter(text[0]), findLetter(text[1])],
        [findLetter(text[2]), findLetter(text[3])],
    ];
}

function matrixToText(m) {
    return getLetter(m[0][0]) + getLetter(m[0][1]) +
        getLetter(m[1][0]) + getLetter(m[1][1]);
}

function detMatrix(m) {
    return ((m[0][0] * m[1][1] - m[0][1] * m[1][0]) % 26 + 26) % 26;
}

function modInverse(a) {
    const aa = ((a % 26) + 26) % 26;
    for (let x = 1; x < 26; x++) if ((aa * x) % 26 === 1) return x;
    return null; // no invertible
}

function matMul(A, B) {
    return [
        [
            (A[0][0] * B[0][0] + A[0][1] * B[1][0]) % 26,
            (A[0][0] * B[0][1] + A[0][1] * B[1][1]) % 26,
        ],
        [
            (A[1][0] * B[0][0] + A[1][1] * B[1][0]) % 26,
            (A[1][0] * B[0][1] + A[1][1] * B[1][1]) % 26,
        ],
    ];
}

function inverseMatrix(m) {
    const detInv = modInverse(detMatrix(m));
    if (detInv === null) return null;
    const adj = [
        [m[1][1], -m[0][1]],
        [-m[1][0], m[0][0]],
    ];
    return [
        [(detInv * adj[0][0] % 26 + 26) % 26, (detInv * adj[0][1] % 26 + 26) % 26],
        [(detInv * adj[1][0] % 26 + 26) % 26, (detInv * adj[1][1] % 26 + 26) % 26],
    ];
}

function hillEncrypt(mensaje, clave) {
    try {
        const mClave = textToMatrix(clave);
        const padded = padMessage(mensaje.toUpperCase().replace(/[^A-Z]/g, ""));
        let cifrado = "";
        for (let i = 0; i < padded.length; i += 4) {
            const block = textToMatrix(padded.slice(i, i + 4));
            const result = matMul(block, mClave);
            cifrado += matrixToText(result);
        }
        return cifrado;
    } catch { return "——"; }
}

function hillDecrypt(cifrado, clave) {
    try {
        const mClave = inverseMatrix(textToMatrix(clave));
        if (!mClave) return "CLAVE INVÁLIDA";
        const padded = padMessage(cifrado.toUpperCase().replace(/[^A-Z]/g, ""));
        let mensaje = "";
        for (let i = 0; i < padded.length; i += 4) {
            const block = textToMatrix(padded.slice(i, i + 4));
            const result = matMul(block, mClave);
            mensaje += matrixToText(result);
        }
        return mensaje;
    } catch { return "——"; }
}

function isValidKey(clave) {
    if (clave.length !== 4) return false;
    const m = textToMatrix(clave);
    return modInverse(detMatrix(m)) !== null;
}

/* =========================================================
   COMPONENT
   ========================================================= */
function Hill() {
    /* ── STATE ── */
    const [plainText, setPlainText] = useState("XXXX");
    const [keyword, setKeyword] = useState("LIDH");
    const [showMathHelp, setShowMathHelp] = useState(false);
    const [showHistoryHelp, setShowHistoryHelp] = useState(false);
    const [showMatrixHelp, setShowMatrixHelp] = useState(false);
    const [mode, setMode] = useState("encrypt"); // "encrypt" | "decrypt"

    /* ── REFS ── */
    const heroRef = useRef(null);
    const heroCircleRef = useRef(null);
    const heroMascotRef = useRef(null);
    const bandLabRef = useRef(null);
    const mathCardRef = useRef(null);
    const gameCardRef = useRef(null);

    /* ── COMPUTED ── */
    const safeKey = keyword.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4).padEnd(4, "A");
    const safePlain = plainText.toUpperCase().replace(/[^A-Z]/g, "") || "XXXX";
    const validKey = isValidKey(safeKey);
    const keyMatrix = validKey ? textToMatrix(safeKey) : null;
    const invMatrix = validKey ? inverseMatrix(textToMatrix(safeKey)) : null;
    const encryptedText = validKey ? hillEncrypt(safePlain, safeKey) : "——";
    const decryptedText = validKey ? hillDecrypt(encryptedText, safeKey) : "——";

    // Para la visualización del bloque activo en el hero
    const padded = padMessage(safePlain);
    const block1 = padded.slice(0, 4);
    const encBlock1 = validKey ? hillEncrypt(block1, safeKey).slice(0, 4) : "——";

    /* ── GSAP ANIMATION ── */
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.timeline()
                .from(heroRef.current, { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" })
                .from(heroCircleRef.current, { opacity: 0, scale: 0.85, duration: 0.5, ease: "back.out(1.4)" }, "-=0.3")
                .from(heroMascotRef.current, { opacity: 0, x: 18, duration: 0.5, ease: "power2.out" }, "-=0.3")
                .from(bandLabRef.current, { opacity: 0, y: 16, duration: 0.55, ease: "power2.out" }, "-=0.1")
                .from(mathCardRef.current, { opacity: 0, y: 16, duration: 0.5, ease: "power2.out" }, "-=0.2")
                .from(gameCardRef.current, { opacity: 0, y: 16, duration: 0.5, ease: "power2.out" }, "-=0.3");
        });
        return () => ctx.revert();
    }, []);

    /* ── HELPERS ── */
    const renderMatrix = (m, label) => (
        <div className="hill-matrix-block">
            <span className="hill-matrix-label">{label}</span>
            <table className="hill-matrix">
                <tbody>
                    {m.map((row, ri) => (
                        <tr key={ri}>
                            {row.map((val, ci) => (
                                <td key={ci} className="hill-matrix-cell">{val}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    /* ── RENDER ── */
    return (
        <div className="hill-page">
            <div className="container hill-shell">

                {/* ════════════════════════ HERO ════════════════════════ */}
                <section className="hill-hero" ref={heroRef}>
                    <div className="hero-copy">
                        <span className="hero-badge">Lección · Cifrado matricial</span>
                        <h1 className="hero-copy-tittle">
                            Juega con el{" "}
                            <DecryptedText
                                text="Cifrado Hill"
                                className="hero-copy-tittle"
                                encryptedClassName="hero-copy-tittle text-encrypted"
                                speed={120}
                                maxIterations={60}
                            />
                        </h1>
                        <TextType
                            as="p"
                            text="Una clave que se convierte en matriz, álgebra lineal mod 26 y bloques de letras. Descubre cómo Lester Hill llevó las matemáticas al corazón de la criptografía."
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
                                <div className="k-label">Bloque</div>
                                <div className="k-value">{block1.slice(0, 2)}</div>
                                <div className="k-value-small">→ {encBlock1.slice(0, 2)}</div>
                            </div>
                        </div>
                        <div className="hero-circle hero-circle-small hero-circle-1" />
                        <div className="hero-circle hero-circle-small hero-circle-2" />
                    </div>
                </section>

                {/* ════════════════════════ BANDA 1 ════════════════════ */}
                <section className="hill-band band-lab">
                    <div className="band-lab-inner" ref={bandLabRef}>
                        <div className="lab-core">
                            <div className="lab-header-row">
                                <div>
                                    <h2>
                                        <DecryptedText
                                            text="La llave como matriz"
                                            className="h2"
                                            encryptedClassName="h2 text-encrypted"
                                            speed={120}
                                            maxIterations={60}
                                        />
                                    </h2>
                                    <p className="lab-subtitle">
                                        4 letras de clave forman una matriz 2×2. Cada bloque de 4 letras del
                                        mensaje se multiplica por esa matriz en mod 26.
                                    </p>
                                </div>
                                <div className="lab-keyword-input">
                                    <label>
                                        Clave (4 letras)
                                        <input
                                            type="text"
                                            className={`form-control ${!validKey ? "input-error" : ""}`}
                                            value={keyword}
                                            maxLength={4}
                                            onChange={(e) =>
                                                setKeyword(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))
                                            }
                                            placeholder="Ej. LIDH"
                                        />
                                        {!validKey && keyword.length === 4 && (
                                            <small className="error-hint">
                                                Determinante sin inverso en mod 26. Cambia la clave.
                                            </small>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Matrices: K y K⁻¹ */}
                            <div className="hill-matrices-row">
                                {keyMatrix && renderMatrix(keyMatrix, "K (clave)")}
                                {invMatrix && renderMatrix(invMatrix, "K⁻¹ (descifrado)")}
                                {keyMatrix && (
                                    <div className="hill-det-block">
                                        <span className="hill-matrix-label">det(K) mod 26</span>
                                        <span className="hill-det-value">{detMatrix(keyMatrix)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Visualización paso a paso del primer bloque */}
                            <div className="hill-step-row">
                                <div className="hill-step-block">
                                    <span className="digraph-label">Bloque texto:</span>
                                    <div className="digraph-pair">
                                        {block1.split("").map((l, i) => (
                                            <span key={i} className="digraph-letter plain">{l}</span>
                                        ))}
                                    </div>
                                </div>
                                <span className="digraph-arrow">× K</span>
                                <div className="hill-step-block">
                                    <span className="digraph-label">Bloque cifrado:</span>
                                    <div className="digraph-pair">
                                        {encBlock1.split("").map((l, i) => (
                                            <span key={i} className="digraph-letter cipher">{l}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Historia flotante */}
                        <aside className="history-floating">
                            <h3>
                                <DecryptedText
                                    text="Un matemático criptógrafo"
                                    className="h3"
                                    encryptedClassName="h3 text-encrypted"
                                    speed={120}
                                    maxIterations={60}
                                />
                            </h3>
                            <TextType
                                as="p"
                                text="En 1929, Lester S. Hill publicó 'Cryptography in an Algebraic Alphabet', siendo el primero en aplicar álgebra lineal a la criptografía. Su cifrado opera sobre bloques completos, lo que destruye el análisis de frecuencia de letras individuales."
                                typingSpeed={25}
                                deletingSpeed={65}
                                pauseDuration={1800}
                                textColors={["var(--cf-text)"]}
                            />
                            <button className="math-help-button" onClick={() => setShowHistoryHelp(true)}>
                                Leer más →
                            </button>
                        </aside>
                    </div>
                </section>

                {/* ════════════════════════ BANDA 2 ════════════════════ */}
                <section className="hill-band band-bottom">
                    <div className="band-grid">

                        {/* ── MATH CARD ── */}
                        <div className="card-free math-card" ref={mathCardRef}>
                            <div className="math-header-row">
                                <div className="math-header-text">
                                    <h2>
                                        <DecryptedText
                                            text="Álgebra lineal mod 26"
                                            className="h2"
                                            encryptedClassName="h2 text-encrypted"
                                            speed={120}
                                            maxIterations={60}
                                        />
                                    </h2>
                                </div>
                                <button className="math-help-button" onClick={() => setShowMathHelp(true)}>
                                    ¿Inversa?
                                </button>
                                <button className="math-help-button" onClick={() => setShowMatrixHelp(true)}>
                                    ¿Mod 26?
                                </button>
                            </div>

                            <p>
                                El cifrado de Hill representa el mensaje como una sucesión de vectores
                                columna y la clave como una matriz K. Cifrar es simplemente multiplicar
                                cada vector por K en aritmética modular:
                            </p>
                            <BlockMath math="\mathbf{c} = \mathbf{m} \cdot K \pmod{26}" />

                            <p className="math-explanation"><strong>Para t = 2</strong> (bloques de 4 letras → 2 filas × 2 col):</p>
                            <BlockMath math="\begin{pmatrix} c_1 & c_2 \\ c_3 & c_4 \end{pmatrix} = \begin{pmatrix} m_1 & m_2 \\ m_3 & m_4 \end{pmatrix} \cdot K \pmod{26}" />

                            <p>Para descifrar se usa la matriz inversa modular:</p>
                            <BlockMath math="\mathbf{m} = \mathbf{c} \cdot K^{-1} \pmod{26}" />

                            <p className="math-explanation">La inversa de K se calcula como:</p>
                            <BlockMath math="K^{-1} = (\det K)^{-1} \cdot \text{Adj}(K) \pmod{26}" />

                            <ul className="math-list">
                                <li>
                                    <InlineMath math="\det K = (ad - bc) \bmod 26" /> — debe tener inverso
                                    multiplicativo en mod 26 (es decir, <InlineMath math="\gcd(\det K,\,26)=1" />).
                                </li>
                                <li>
                                    <InlineMath math="\text{Adj}(K)" /> es la matriz adjunta:{" "}
                                    <InlineMath math="\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}" />.
                                </li>
                                <li>
                                    El inverso de <InlineMath math="\det K" /> se halla con el{" "}
                                    <strong>Algoritmo de Euclides Extendido</strong>.
                                </li>
                                <li>
                                    El pad rellena con <strong>X</strong> si el mensaje no es múltiplo de 4,
                                    igual que Playfair hace con dígrаfos incompletos.
                                </li>
                            </ul>
                            <img src={StudyGif} alt="Mascota estudiando" className="math-mascot" />
                        </div>

                        {/* ── GAME CARD ── */}
                        <div className="card-free game-card" ref={gameCardRef}>
                            <h2>
                                <DecryptedText
                                    text="Cifra tu mensaje"
                                    className="h2"
                                    encryptedClassName="h2 text-encrypted"
                                    speed={120}
                                    maxIterations={60}
                                />
                            </h2>
                            <TextType
                                as="p"
                                text="Escribe un mensaje y una clave de 4 letras. Observa cómo el mismo bloque de letras puede producir resultados completamente distintos con claves diferentes, a diferencia del César."
                                typingSpeed={25}
                                deletingSpeed={65}
                                pauseDuration={1800}
                                textColors={["var(--cf-text)"]}
                            />

                            {/* Toggle cifrar / descifrar */}
                            <div className="hill-mode-toggle">
                                <button
                                    className={`toggle-btn ${mode === "encrypt" ? "active" : ""}`}
                                    onClick={() => setMode("encrypt")}
                                >
                                    Cifrar
                                </button>
                                <button
                                    className={`toggle-btn ${mode === "decrypt" ? "active" : ""}`}
                                    onClick={() => setMode("decrypt")}
                                >
                                    Descifrar
                                </button>
                            </div>

                            <div className="example-controls">
                                <label>
                                    {mode === "encrypt" ? "Texto en claro" : "Texto cifrado"}
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={plainText}
                                        onChange={(e) =>
                                            setPlainText(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))
                                        }
                                        placeholder="Ej. JULY"
                                        maxLength={32}
                                    />
                                </label>
                                <label>
                                    Clave (4 letras)
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={keyword}
                                        maxLength={4}
                                        onChange={(e) =>
                                            setKeyword(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))
                                        }
                                        placeholder="Ej. LIDH"
                                    />
                                </label>
                            </div>

                            <div className="example-results">
                                <div>
                                    <span className="example-label">Preparado (pad)</span>
                                    <p style={{ color: "var(--cf-orange)" }}>{padMessage(safePlain)}</p>
                                </div>
                                <div>
                                    <span className="example-label">
                                        {mode === "encrypt" ? "Cifrado" : "Descifrado"}
                                    </span>
                                    <ScrambledText radius={10} duration={5} speed={0.1} className="p">
                                        {mode === "encrypt" ? encryptedText : decryptedText}
                                    </ScrambledText>
                                </div>
                            </div>

                            <TextType
                                as="p"
                                className="game-tip"
                                text="¿Notas que cambiar una sola letra de la clave produce un texto completamente diferente? Esa difusión es la gran ventaja del cifrado por bloques matriciales."
                                typingSpeed={22}
                                deletingSpeed={65}
                                pauseDuration={1800}
                                textColors={["var(--cf-text)"]}
                            />
                        </div>

                    </div>
                </section>

            </div>

            {/* ════════════ MODALES ════════════ */}

            {/* Modal 1 — ¿Cómo se calcula la inversa? */}
            {showMathHelp && (
                <div className="modal-backdrop" onClick={() => setShowMathHelp(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-with-fox">
                            <h3>¿Cómo se calcula K⁻¹ mod 26?</h3>
                            <img src={HelpGif} alt="Mascota ayuda" className="modal-mascot" />
                        </div>
                        <p>
                            Para una matriz 2×2 <InlineMath math="K = \begin{pmatrix} a & b \\ c & d \end{pmatrix}" />,
                            su inversa modular se obtiene en tres pasos:
                        </p>
                        <ul className="math-list">
                            <li>
                                <strong>Paso 1 — Determinante:</strong>{" "}
                                <InlineMath math="\det K = (ad - bc) \bmod 26" />. Si el resultado es 0 o
                                no es coprimo con 26, la clave no tiene inversa y no sirve.
                            </li>
                            <li>
                                <strong>Paso 2 — Inverso modular del det:</strong> encontrar{" "}
                                <InlineMath math="x" /> tal que{" "}
                                <InlineMath math="(\det K) \cdot x \equiv 1 \pmod{26}" />. Se usa el
                                Algoritmo de Euclides Extendido (o fuerza bruta en el rango 1–25).
                            </li>
                            <li>
                                <strong>Paso 3 — Adjunta × inverso del det:</strong>
                            </li>
                        </ul>
                        <BlockMath math="K^{-1} = (\det K)^{-1} \cdot \begin{pmatrix} d & -b \\ -c & a \end{pmatrix} \pmod{26}" />
                        <p>Ejemplo con la clave <strong>LIDH</strong> (L=11, I=8, D=3, H=7):</p>
                        <BlockMath math="K = \begin{pmatrix} 11 & 8 \\ 3 & 7 \end{pmatrix} \quad \det K = (77 - 24) \bmod 26 = 53 \bmod 26 = 1" />
                        <BlockMath math="(\det K)^{-1} = 1 \quad K^{-1} = \begin{pmatrix} 7 & -8 \\ -3 & 11 \end{pmatrix} \bmod 26 = \begin{pmatrix} 7 & 18 \\ 23 & 11 \end{pmatrix}" />
                        <button className="close-button" onClick={() => setShowMathHelp(false)}>
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            {/* Modal 2 — Historia */}
            {showHistoryHelp && (
                <div className="modal-backdrop" onClick={() => setShowHistoryHelp(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-with-fox">
                            <h3>Historia del Cifrado Hill</h3>
                            <img src={HelpGif} alt="Mascota ayuda" className="modal-mascot" />
                        </div>
                        <p>
                            El cifrado de Hill fue publicado en <strong>1929</strong> por el matemático
                            estadounidense <strong>Lester S. Hill</strong> en el artículo{" "}
                            <em>"Cryptography in an Algebraic Alphabet"</em>. Fue el primer sistema
                            criptográfico de uso práctico en emplear herramientas del{" "}
                            <strong>álgebra lineal</strong>.
                        </p>
                        <h4 style={{ marginTop: "1rem" }}>¿Por qué fue revolucionario?</h4>
                        <p>
                            Los cifrados anteriores (César, Vigenère) operaban letra a letra. Hill operaba
                            sobre <strong>bloques de letras simultáneamente</strong>, lo que destruía por
                            completo el análisis de frecuencia simple: la misma letra puede cifrarse de
                            formas distintas dependiendo de su contexto en el bloque.
                        </p>
                        <h4 style={{ marginTop: "1rem" }}>Debilidades conocidas</h4>
                        <p>
                            El cifrado Hill es vulnerable al{" "}
                            <strong>ataque de texto claro conocido</strong>: con suficientes pares
                            (mensaje, cifrado) se puede reconstruir la matriz K resolviendo un sistema de
                            ecuaciones lineales en mod 26. Esto lo hace inseguro en la práctica moderna,
                            pero es la base conceptual de los cifrados por bloques actuales como{" "}
                            <strong>AES</strong>.
                        </p>
                        <h4 style={{ marginTop: "1rem" }}>Legado</h4>
                        <p>
                            Hill demostró que las matemáticas abstractas podían tener aplicaciones
                            criptográficas directas. Su trabajo inspiró el desarrollo de la teoría moderna
                            de cifrados por bloques y el uso generalizado del álgebra lineal en
                            criptografía y teoría de códigos.
                        </p>
                        <button className="close-button" onClick={() => setShowHistoryHelp(false)}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* Modal 3 — ¿Qué significa mod 26 en matrices? */}
            {showMatrixHelp && (
                <div className="modal-backdrop" onClick={() => setShowMatrixHelp(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-with-fox">
                            <h3>Multiplicación de matrices mod 26</h3>
                            <img src={HelpGif} alt="Mascota ayuda" className="modal-mascot" />
                        </div>
                        <p>
                            La multiplicación de matrices funciona igual que en álgebra normal, pero al
                            final de cada operación se aplica <InlineMath math="\bmod 26" /> para
                            mantener los resultados en el rango de letras (0–25).
                        </p>
                        <p>Ejemplo con el bloque "JU" → números [9, 20] y la clave LIDH:</p>
                        <BlockMath math="\begin{pmatrix} 9 & 20 \end{pmatrix} \cdot \begin{pmatrix} 11 & 8 \\ 3 & 7 \end{pmatrix} = \begin{pmatrix} 9{\cdot}11+20{\cdot}3 & 9{\cdot}8+20{\cdot}7 \end{pmatrix}" />
                        <BlockMath math="= \begin{pmatrix} 99+60 & 72+140 \end{pmatrix} = \begin{pmatrix} 159 & 212 \end{pmatrix} \equiv \begin{pmatrix} 3 & 4 \end{pmatrix} \pmod{26}" />
                        <p>
                            <InlineMath math="3 \to D" /> y <InlineMath math="4 \to E" />, así que "JU"
                            se cifra como <strong>"DE"</strong>. De forma análoga "LY" → "LW", y el
                            mensaje completo "JULY" → <strong>"DELW"</strong>.
                        </p>
                        <button className="close-button" onClick={() => setShowMatrixHelp(false)}>
                            Entendido
                        </button>
                    </div>
                </div>
            )}


        </div>
    );
}

export default Hill;
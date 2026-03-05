import { useState, useRef, useEffect } from "react";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";
import "./Playfair.css";
import WelcomeGif from "../../../assets/welcome.gif";
import StudyGif from "../../../assets/study.gif";
import HelpGif from "../../../assets/help.gif";
import DecryptedText from "../../../components/text/DecryptedText";
import TextType from "../../../components/text/TextType";
import ScrambledText from "../../../components/text/ScrambleText";
import { gsap } from "gsap";

/* =========================================================
   CIPHER LOGIC
   ========================================================= */

function crearMatriz(clave) {
    const alfabeto = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    const claveUp = clave.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
    const combined = claveUp + alfabeto;
    const seen = new Set();
    const unique = [];
    for (const ch of combined) {
        if (!seen.has(ch)) { seen.add(ch); unique.push(ch); }
    }
    const matriz = [];
    for (let i = 0; i < 5; i++) {
        matriz.push(unique.slice(i * 5, i * 5 + 5));
    }
    return matriz;
}

function findPosition(matriz, char) {
    const c = char === "J" ? "I" : char;
    for (let r = 0; r < 5; r++)
        for (let col = 0; col < 5; col++)
            if (matriz[r][col] === c) return [r, col];
    return [-1, -1];
}

function prepareText(text) {
    let s = text.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
    let result = "";
    let i = 0;
    while (i < s.length) {
        result += s[i];
        if (i + 1 < s.length) {
            if (s[i] === s[i + 1]) {
                result += "X";
                i++;
            } else {
                result += s[i + 1];
                i += 2;
            }
        } else {
            i++;
        }
    }
    if (result.length % 2 !== 0) result += "X";
    return result;
}

function playfairEncrypt(mensaje, clave) {
    const matriz = crearMatriz(clave);
    const prepared = prepareText(mensaje);
    let cifrado = "";
    for (let i = 0; i < prepared.length; i += 2) {
        const c1 = prepared[i];
        const c2 = prepared[i + 1];
        const [r1, col1] = findPosition(matriz, c1);
        const [r2, col2] = findPosition(matriz, c2);
        if (r1 === r2) {
            cifrado += matriz[r1][(col1 + 1) % 5] + matriz[r2][(col2 + 1) % 5];
        } else if (col1 === col2) {
            cifrado += matriz[(r1 + 1) % 5][col1] + matriz[(r2 + 1) % 5][col2];
        } else {
            cifrado += matriz[r1][col2] + matriz[r2][col1];
        }
    }
    return cifrado;
}

function playfairDecrypt(cifrado, clave) {
    const matriz = crearMatriz(clave);
    const prepared = cifrado.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
    let decrypted = "";
    for (let i = 0; i < prepared.length; i += 2) {
        const c1 = prepared[i];
        const c2 = prepared[i + 1];
        const [r1, col1] = findPosition(matriz, c1);
        const [r2, col2] = findPosition(matriz, c2);
        if (r1 === r2) {
            decrypted += matriz[r1][(col1 - 1 + 5) % 5] + matriz[r2][(col2 - 1 + 5) % 5];
        } else if (col1 === col2) {
            decrypted += matriz[(r1 - 1 + 5) % 5][col1] + matriz[(r2 - 1 + 5) % 5][col2];
        } else {
            decrypted += matriz[r1][col2] + matriz[r2][col1];
        }
    }
    return decrypted;
}

/* =========================================================
   COMPONENT
   ========================================================= */

function Playfair() {

    /* ── STATE ── */
    const [plainText, setPlainText] = useState("HOLA MUNDO");
    const [keyword, setKeyword] = useState("PLAYFAIR");
    const [showDigraphHelp, setShowDigraphHelp] = useState(false);
    const [showHistoryHelp, setShowHistoryHelp] = useState(false);
    const [showMatrixHelp, setShowMatrixHelp] = useState(false);

    /* ── REFS ── */
    const heroRef = useRef(null);
    const heroCircleRef = useRef(null);
    const heroMascotRef = useRef(null);
    const bandLabRef = useRef(null);
    const mathCardRef = useRef(null);
    const gameCardRef = useRef(null);

    /* ── COMPUTED ── */
    const safeKeyword = keyword.toUpperCase().replace(/[^A-Z]/g, "") || "PLAYFAIR";
    const safePlain = plainText.toUpperCase().replace(/[^A-Z ]/g, "");
    const safePlainLetters = safePlain.replace(/ /g, "");
    const matriz = crearMatriz(safeKeyword);
    const prepared = prepareText(safePlainLetters || "HOLA");
    const encryptedText = playfairEncrypt(safePlainLetters || "HOLA", safeKeyword);
    const decryptedText = playfairDecrypt(encryptedText, safeKeyword);

    const dig1 = prepared[0] || "H";
    const dig2 = prepared[1] || "O";

    const [hr1, hc1] = findPosition(matriz, dig1);
    const [hr2, hc2] = findPosition(matriz, dig2);

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

    /* ── RENDER ── */
    return (
        <div className="playfair-page">
            <div className="container playfair-shell">

                {/* ════════════════════════════════════════
            HERO
            ════════════════════════════════════════ */}
                <section className="playfair-hero" ref={heroRef}>
                    <div className="hero-copy">
                        <span className="hero-badge">Lección · Cifrado poligráfico</span>
                        <h1 className="hero-copy-tittle">
                            Juega con el{" "}
                            <DecryptedText
                                text="Cifrado Playfair"
                                className="hero-copy-tittle"
                                encryptedClassName="hero-copy-tittle text-encrypted"
                                speed={120}
                                maxIterations={60}
                            />
                        </h1>
                        <TextType
                            as="p"
                            text="Una clave que construye una matriz 5×5, pares de letras y reglas geométricas. Descubre cómo el primer cifrado poligráfico de la historia oculta tus mensajes."
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
                                <div className="k-label">Dígrafo</div>
                                <div className="k-value">{dig1}{dig2}</div>
                            </div>
                        </div>
                        <div className="hero-circle hero-circle-small hero-circle-1" />
                        <div className="hero-circle hero-circle-small hero-circle-2" />
                    </div>
                </section>

                {/* ════════════════════════════════════════
            BANDA 1 — LABORATORIO + HISTORIA FLOTANTE
            ════════════════════════════════════════ */}
                <section className="playfair-band band-lab">
                    <div className="band-lab-inner" ref={bandLabRef}>

                        {/* Lab Core */}
                        <div className="lab-core">
                            <div className="lab-header-row">
                                <div>
                                    <h2>
                                        <DecryptedText
                                            text="La matriz Playfair"
                                            className="h2"
                                            encryptedClassName="h2 text-encrypted"
                                            speed={120}
                                            maxIterations={60}
                                        />
                                    </h2>
                                    <p className="lab-subtitle">
                                        La clave construye una cuadrícula 5×5 con las letras del alfabeto
                                        (I y J comparten celda). La posición de cada par de letras en la
                                        cuadrícula determina cómo se cifran.
                                    </p>
                                </div>
                            </div>

                            {/* 5×5 Matrix */}
                            <div className="playfair-matrix-wrapper">
                                <table className="playfair-matrix">
                                    <thead>
                                        <tr>
                                            <th className="matrix-header-cell"></th>
                                            {[0, 1, 2, 3, 4].map((col) => (
                                                <th key={col} className="matrix-header-cell">{col + 1}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {matriz.map((row, rowIdx) => (
                                            <tr key={rowIdx}>
                                                <td className="matrix-header-cell">{rowIdx + 1}</td>
                                                {row.map((letter, colIdx) => {
                                                    let cellClass = "matrix-cell";
                                                    if (rowIdx === hr1 && colIdx === hc1)
                                                        cellClass += " matrix-cell-highlight-plain";
                                                    else if (rowIdx === hr2 && colIdx === hc2)
                                                        cellClass += " matrix-cell-highlight-cipher";
                                                    return (
                                                        <td key={colIdx} className={cellClass}>
                                                            {letter}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Active digraph display */}
                            <div className="digraph-display">
                                <span className="digraph-label">Dígrafo activo:</span>
                                <div className="digraph-pair">
                                    <span className="digraph-letter plain">{dig1}</span>
                                    <span className="digraph-letter plain">{dig2}</span>
                                </div>
                                <span className="digraph-arrow">→</span>
                                <div className="digraph-pair">
                                    <span className="digraph-letter cipher">{encryptedText[0] || "?"}</span>
                                    <span className="digraph-letter cipher">{encryptedText[1] || "?"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Historia Flotante */}
                        <aside className="history-floating">
                            <h3>
                                <DecryptedText
                                    text="El primer cifrado poligráfico"
                                    className="h3"
                                    encryptedClassName="h3 text-encrypted"
                                    speed={120}
                                    maxIterations={60}
                                />
                            </h3>
                            <p>
                                <TextType
                                    as="p"
                                    text="Inventado por Charles Wheatstone en 1854, pero popularizado y nombrado por el Barón Lyon Playfair. Fue el primer cifrado en operar sobre pares de letras en lugar de una sola, haciendo inútil el análisis de frecuencias simple."
                                    typingSpeed={25}
                                    deletingSpeed={65}
                                    pauseDuration={1800}
                                    textColors={["var(--cf-text)"]}
                                />

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
                <section className="playfair-band band-bottom">
                    <div className="band-grid">

                        {/* ── MATH CARD ── */}
                        <div className="card-free math-card" ref={mathCardRef}>
                            <div className="math-header-row">
                                <div className="math-header-text">
                                    <h2>
                                        <DecryptedText
                                            text="La regla geométrica"
                                            className="h2"
                                            encryptedClassName="h2 text-encrypted"
                                            speed={120}
                                            maxIterations={60}
                                        />
                                    </h2>
                                </div>
                                <button
                                    className="math-help-button"
                                    onClick={() => setShowDigraphHelp(true)}
                                >
                                    ¿Dígrаfos?
                                </button>
                                <button
                                    className="math-help-button"
                                    onClick={() => setShowMatrixHelp(true)}
                                >
                                    ¿La matriz?
                                </button>
                            </div>

                            <p>
                                Cada par de letras (dígrafo) del mensaje se localiza en la matriz 5×5.
                                Dependiendo de su posición relativa, se aplica una de tres reglas:
                            </p>

                            <p className="math-explanation">
                                <strong>1. Misma fila</strong> — desplazar a la derecha (circular):
                            </p>
                            <BlockMath math="c_i = M[r_a][(c_a+1)\bmod 5] \qquad c_j = M[r_b][(c_b+1)\bmod 5]" />

                            <p className="math-explanation">
                                <strong>2. Misma columna</strong> — desplazar hacia abajo (circular):
                            </p>
                            <BlockMath math="c_i = M[(r_a+1)\bmod 5][c_a] \qquad c_j = M[(r_b+1)\bmod 5][c_b]" />

                            <p className="math-explanation">
                                <strong>3. Rectángulo</strong> — intercambiar columnas:
                            </p>
                            <BlockMath math="c_i = M[r_a][c_b] \qquad c_j = M[r_b][c_a]" />

                            <p style={{ fontSize: "0.9rem", marginTop: "0.8rem" }}>
                                Para el <strong>descifrado</strong>, las reglas se invierten: fila →
                                izquierda, columna → arriba. El rectángulo es su propio inverso: el
                                intercambio de columnas funciona igual en ambas direcciones, haciendo
                                de esta la regla más elegante del cifrado.
                            </p>

                            <ul className="math-list">
                                <li>
                                    El espacio de claves es enorme: <InlineMath math="25! \approx 10^{25}" /> posibles matrices.
                                </li>
                                <li>
                                    Opera sobre dígrаfos: la misma letra puede cifrarse de forma distinta
                                    según cuál sea su pareja en cada par.
                                </li>
                                <li>
                                    I y J se tratan como la misma letra para completar el cuadrado 5×5 con
                                    las 25 posiciones disponibles.
                                </li>
                                <li>
                                    Si un par tiene letras repetidas (ej. LL), se inserta una X para
                                    separarlas antes del cifrado.
                                </li>
                            </ul>

                            <img src={StudyGif} alt="Mascota estudiando" className="math-mascot" />
                        </div>

                        {/* ── GAME CARD ── */}
                        <div className="card-free game-card" ref={gameCardRef}>
                            <h2>
                                <DecryptedText
                                    text="Cifra tu mensaje secreto"
                                    className="h2"
                                    encryptedClassName="h2 text-encrypted"
                                    speed={120}
                                    maxIterations={60}
                                />
                            </h2>
                            <TextType
                                as="p"
                                text="El texto se divide en pares de letras antes de cifrarse. ¡Observa cómo cambia el dígrafo activo en la matriz mientras escribes!"
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
                                            setKeyword(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))
                                        }
                                        placeholder="Ej. PLAYFAIR"
                                        maxLength={20}
                                    />
                                </label>
                            </div>

                            <div className="example-results">
                                <div>
                                    <span className="example-label">Preparado</span>
                                    <p style={{ color: "var(--cf-orange)" }}>{prepared || "—"}</p>
                                </div>
                                <div>
                                    <span className="example-label">Clave activa</span>
                                    <p>{safeKeyword || "—"}</p>
                                </div>
                                <div>
                                    <span className="example-label">Cifrado</span>
                                    <ScrambledText radius={10} duration={5} speed={0.1} className="p">
                                        {encryptedText || "—"}
                                    </ScrambledText>
                                </div>
                                <div>
                                    <span className="example-label">Descifrado</span>
                                    <ScrambledText radius={10} duration={5} speed={0.1} className="p">
                                        {decryptedText || "—"}
                                    </ScrambledText>
                                </div>
                            </div>

                            <TextType
                                as="p"
                                className="game-tip"
                                text="¿Ves cómo el texto preparado tiene siempre un número par de letras? Esa preparación es fundamental para que las reglas de la matriz funcionen correctamente."
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
          MODAL 1 — ¿Qué son los dígrаfos?
          ════════════════════════════════════════ */}
            {showDigraphHelp && (
                <div className="modal-backdrop" onClick={() => setShowDigraphHelp(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-with-fox">
                            <h3>¿Qué son los dígrаfos?</h3>
                            <img src={HelpGif} alt="Mascota ayuda" className="modal-mascot" />
                        </div>
                        <p>
                            Un <strong>dígrafo</strong> es simplemente un par de letras. Playfair cifra
                            de dos en dos, no letra a letra. Antes de cifrar, el texto debe prepararse
                            siguiendo tres reglas estrictas:
                        </p>
                        <ul className="math-list">
                            <li>
                                <strong>I y J son la misma letra:</strong> todas las J del texto se
                                convierten en I antes de procesarlo, ya que la cuadrícula 5×5 solo tiene
                                25 celdas para 26 letras.
                            </li>
                            <li>
                                <strong>Letras repetidas en un par:</strong> si al dividir el texto en
                                pares aparecen dos letras iguales juntas (como LL en HELLO), se inserta
                                una X entre ellas para separarlas: HE · LX · LO.
                            </li>
                            <li>
                                <strong>Longitud impar:</strong> si el texto final tiene un número impar
                                de letras, se añade una X al final para completar el último par.
                            </li>
                        </ul>
                        <p>Ejemplo con "BALLOON" y clave "PLAYFAIR":</p>
                        <BlockMath math="\text{BALLOON} \rightarrow \text{BALXLOON} \rightarrow \text{BA} \cdot \text{LX} \cdot \text{LO} \cdot \text{ON}" />
                        <p style={{ fontSize: "0.88rem", color: "rgba(249,244,244,0.75)" }}>
                            Esta preparación garantiza que siempre trabajemos con pares completos y que
                            ningún par tenga letras repetidas, condición indispensable para que las tres
                            reglas geométricas de la matriz funcionen correctamente.
                        </p>
                        <button className="close-button" onClick={() => setShowDigraphHelp(false)}>
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════════
          MODAL 2 — Historia del Cifrado Playfair
          ════════════════════════════════════════ */}
            {showHistoryHelp && (
                <div className="modal-backdrop" onClick={() => setShowHistoryHelp(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-with-fox">
                            <h3>🗂️ Historia del Cifrado Playfair</h3>
                            <img src={HelpGif} alt="Mascota ayuda" className="modal-mascot" />
                        </div>
                        <p>
                            El cifrado Playfair fue inventado en <strong>1854</strong> por el físico
                            británico <strong>Sir Charles Wheatstone</strong>, aunque debe su nombre al{" "}
                            <strong>Barón Lyon Playfair</strong>, quien lo promovió activamente ante el
                            gobierno y el ejército británico como herramienta criptográfica de uso
                            práctico en el campo de batalla.
                        </p>

                        <h4 style={{ marginTop: "1rem" }}>⚔️ Uso en conflictos bélicos</h4>
                        <p>
                            El cifrado fue adoptado oficialmente por el ejército británico y empleado
                            durante la <strong>Segunda Guerra de los Bóers</strong> (1899–1902) y la{" "}
                            <strong>Primera Guerra Mundial</strong>. Su ventaja sobre los cifrados
                            monoalfabéticos era evidente: al operar sobre pares de letras, requería
                            analizar más de <strong>600 combinaciones de dígrаfos</strong> en lugar
                            de las 26 letras del análisis de frecuencias estándar, lo que lo hacía
                            significativamente más resistente al criptoanálisis de la época.
                        </p>

                        <h4 style={{ marginTop: "1rem" }}>🔍 Criptoanálisis y debilidades</h4>
                        <p>
                            A pesar de su fortaleza relativa, Playfair tiene vulnerabilidades
                            conocidas. Con suficiente texto cifrado (aproximadamente 100 o más
                            dígrаfos), un analista experto puede romperlo usando{" "}
                            <strong>análisis de frecuencias de pares</strong>, especialmente si conoce
                            el idioma del mensaje original. La técnica de{" "}
                            <strong>texto claro conocido</strong> también lo compromete por completo,
                            ya que permite reconstruir parcialmente la matriz desde unos pocos pares
                            conocidos.
                        </p>

                        <h4 style={{ marginTop: "1rem" }}>📚 Legado en la criptografía moderna</h4>
                        <p>
                            Playfair marcó un hito histórico como el{" "}
                            <strong>primer cifrado poligráfico de uso práctico masivo</strong>. Su
                            principio de operar sobre grupos de letras en lugar de letras individuales
                            anticipó directamente la arquitectura de bloques de los cifrados modernos
                            como <strong>DES</strong> y <strong>AES</strong>. Inspiró además el
                            desarrollo de variantes más complejas como el cifrado{" "}
                            <em>Four-Square</em> y el <em>Two-Square</em>, ambos diseñados para
                            corregir sus debilidades geométricas.
                        </p>

                        <button className="close-button" onClick={() => setShowHistoryHelp(false)}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════════
          MODAL 3 — ¿Cómo se construye la matriz?
          ════════════════════════════════════════ */}
            {showMatrixHelp && (
                <div className="modal-backdrop" onClick={() => setShowMatrixHelp(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-with-fox">
                            <h3>¿Cómo se construye la matriz?</h3>
                            <img src={HelpGif} alt="Mascota ayuda" className="modal-mascot" />
                        </div>
                        <p>
                            La matriz 5×5 es la pieza central del cifrado Playfair. Se construye en
                            tres pasos a partir de la palabra clave elegida:
                        </p>
                        <ul className="math-list">
                            <li>
                                <strong>Paso 1 — Escribir la clave sin repetidos:</strong> anota la
                                palabra clave en orden, omitiendo cualquier letra que ya haya aparecido.
                                Todas las J se tratan como I.
                            </li>
                            <li>
                                <strong>Paso 2 — Completar con el alfabeto restante:</strong> a
                                continuación de la clave, añade las letras del alfabeto (A–Z sin J) que
                                todavía no aparecen, en orden alfabético.
                            </li>
                            <li>
                                <strong>Paso 3 — Rellenar la cuadrícula:</strong> con las 25 letras
                                resultantes, rellena la tabla 5×5 de izquierda a derecha, fila por fila.
                            </li>
                        </ul>
                        <p>
                            Ejemplo paso a paso con la clave <strong>"PLAYFAIR"</strong>:
                        </p>
                        <p style={{ fontFamily: "monospace", fontSize: "0.88rem", lineHeight: "2", background: "rgba(255,255,255,0.05)", padding: "0.8rem 1rem", borderRadius: "8px" }}>
                            Clave sin repetidos:&nbsp;&nbsp;P · L · A · Y · F · I · R<br />
                            Letras restantes:&nbsp;&nbsp;&nbsp;&nbsp;B C D E G H K M N O Q S T U V W X Z<br />
                            <br />
                            <strong>P &nbsp;L &nbsp;A &nbsp;Y &nbsp;F</strong><br />
                            <strong>I &nbsp;R &nbsp;B &nbsp;C &nbsp;D</strong><br />
                            <strong>E &nbsp;G &nbsp;H &nbsp;K &nbsp;M</strong><br />
                            <strong>N &nbsp;O &nbsp;Q &nbsp;S &nbsp;T</strong><br />
                            <strong>U &nbsp;V &nbsp;W &nbsp;X &nbsp;Z</strong>
                        </p>
                        <p style={{ fontSize: "0.88rem", color: "rgba(249,244,244,0.75)", marginTop: "0.8rem" }}>
                            Recuerda: I y J comparten la misma celda. El alfabeto de 25 letras
                            (A–Z sin J) llena exactamente las 25 posiciones del cuadrado 5×5. La
                            seguridad del cifrado depende completamente del secreto de esta clave,
                            ya que quien la conozca puede reconstruir la matriz y descifrar cualquier
                            mensaje.
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

export default Playfair;
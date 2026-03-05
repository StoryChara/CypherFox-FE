const missions_one_time_pad = [
    {
        id: 1,
        title: "Misión 1 · XOR bit a bit",
        description:
            "Cifra en binario usando One-Time Pad. Si M = 1011 y K = 0110, ¿cuál es el cifrado C = M ⊕ K?",
        answer: "1101",
        hint:
            "Aplica XOR bit a bit: 1⊕0, 0⊕1, 1⊕1, 1⊕0. Recuerda la tabla: 0⊕0=0, 0⊕1=1, 1⊕0=1, 1⊕1=0."
    },
    {
        id: 2,
        title: "Misión 2 · Recupera el mensaje",
        description:
            "Sabemos que se cifró con OTP binario y que la clave era K = 1001. Si el cifrado es C = 0110, ¿cuál era el mensaje M original?",
        answer: "1111",
        hint:
            "En OTP, descifrar también es XOR: M = C ⊕ K. Aplica XOR bit a bit entre 0 1 1 0 y 1 0 0 1."
    },
    {
        id: 3,
        title: "Misión 3 · OTP con letras",
        description:
            "Usamos el alfabeto inglés y un One-Time Pad en letras. Si el mensaje es HELLO y la clave es XMCKL, ¿qué cifrado obtienes? Escribe la respuesta en mayúsculas.",
        answer: "EQNVZ",
        hint:
            "Convierte cada letra a número, suma mensaje+clave módulo 26 y vuelve a letras. Por ejemplo H=7, X=23, 7+23=30≡4 → E."
    },
    {
        id: 4,
        title: "Misión 4 · ¿Qué tan larga debe ser la clave?",
        description:
            "Quieres cifrar un mensaje de 20 letras con One-Time Pad alfabético. ¿Cuántas letras debe tener como mínimo la clave K para que el sistema sea realmente un \"pad de un solo uso\"?",
        answer: "20",
        hint:
            "En OTP la clave debe ser al menos tan larga como el mensaje, porque cada posición del mensaje usa una posición distinta de K."
    },
    {
        id: 5,
        title: "Misión 5 · ¿Qué hace tan especial al OTP?",
        description:
            "Responde con una palabra: ¿cómo se llama el tipo de seguridad que tiene el One-Time Pad cuando se usa con una clave realmente aleatoria, tan larga como el mensaje y de un solo uso?",
        answer: "perfecta",
        hint:
            "Shannon demostró que el OTP tiene seguridad \"informacionalmente perfecta\". Busca la palabra clave: seguridad ______."
    }
];

const missions_caesar = [
    {
        id: 1,
        title: "Misión 1 · Descubre la clave",
        description:
            "Tenemos el mensaje CAESAR cifrado como QOSGOF. ¿Cual es la clave k para obtener este cifrado?",
        answer: "14",
        hint:
            "Ajusta la clave k hasta que tu disco produzca QOSGOF a partir de CAESAR. Luego escribe el valor de k. (Usando alfabeto inglés)",
    },
    {
        id: 2,
        title: "Misión 2 · Un nuevo abecedario",
        description:
            "Supón que un atacante ha cifrado el silabario de hiragana japonés. ¿Qué tan grande sería este cifrado?",
        answer: "46",
        hint:
            "Tal vez quieras buscar cuántos caracteres tiene ese silabario. Ese número sería el tamaño del espacio de claves.",
    },
    {
        id: 3,
        title: "Misión 3 · ¿Cuántas claves hay?",
        description:
            "Para el alfabeto que usamos día a día, ¿cuántas claves diferentes de César existen en total?",
        answer: "27",
        hint:
            "Piensa en todas las letras que usamos, recuerda que usamos el espaÑol. Cada valor distinto de k define un cifrado distinto.",
    },
    {
        id: 4,
        title: "Misión 4 · La clave que no hace nada",
        description:
            "Hay un valor de k que no cambia ningún mensaje al cifrarlo: el resultado es exactamente el mismo texto en claro. ¿Cuál es ese valor de k?",
        answer: "0",
        hint:
            "Imagina que en tu disco no giras nada. ¿Qué valor de k corresponde a 'no desplazar' las letras?",
    },
    {
        id: 5,
        title: "Misión 5 · Deshacer una clave",
        description:
            "Si cifras un mensaje con k = 5 y luego vuelves a cifrar el resultado con otra clave k', ¿qué valor de k' necesitas para que el mensaje vuelva a ser el original?",
        answer: "21",
        hint:
            "Busca un número k' tal que 5 + k' sea múltiplo de 26. Recuerda que estamos trabajando módulo 26. (Usando alfabeto inglés)",
    },
    {
        id: 6,
        title: "Misión 6 · ¿Misma clave para todo?",
        description:
            "En un cifrado de César, ¿usar la misma clave k sirve tanto para cifrar como para descifrar? Responde con SI o NO.",
        answer: "NO",
        hint:
            "Para descifrar usamos D_k(y) = (y - k) mod 26. ¿Es lo mismo restar k que volver a sumar k?",
    },
    {
        id: 7,
        title: "Misión 7 · Alfabeto extendido",
        description:
            "Imagina que amplías tu alfabeto a no solo con las letras minúsculas, sino añadimos también las mayúsculas. ¿Cuántas claves posibles de César habría ahora?",
        answer: "52",
        hint:
            "El número de claves posibles siempre coincide con el tamaño del alfabeto que estás usando. (Usando alfabeto inglés)",
    },
];

const missions_vigenere = [
    {
        id: 1,
        title: "Misión 1 · Cifra con Vigenère",
        description:
            "Cifra el mensaje ATAQUE usando la clave LIMON. Aplica la fórmula c_i = (m_i + k_i) mod 26 letra por letra. La clave cicla: L,I,M,O,N,L. Escribe el resultado en mayúsculas.",
        answer: "LBMEHP",
        hint:
            "¿No sabes por dónde empezar? Prueba a usar el cifrador de la lección — escribe ATAQUE como texto y LIMON como clave. ¡La sección 'Cifra tu mensaje secreto' hará el trabajo por ti!"
    },
    {
        id: 2,
        title: "Misión 2 · Descifra el mensaje",
        description:
            "Tienes el mensaje cifrado LBMEHP y sabes que la clave es LIMON. Aplica la fórmula m_i = (c_i - k_i + 26) mod 26 para recuperar el texto original. Escribe el resultado en mayúsculas.",
        answer: "ATAQUE",
        hint:
            "Recuerda que descifrar es la operación inversa: m = (c - k + 26) mod 26. Si tienes dudas, vuelve a la lección y usa el cifrador con ATAQUE y LIMON — verás cómo el resultado de 'Descifrado ✓' confirma el mensaje original."
    },
    {
        id: 3,
        title: "Misión 3 · El ciclo de la clave",
        description:
            "Tienes un mensaje de 12 letras y una clave de 4 letras. ¿Cuántas veces completa la clave su ciclo al cifrar el mensaje entero?",
        answer: "3",
        hint:
            "Divide la longitud del mensaje entre la longitud de la clave: 12 ÷ 4 = ?"
    },
    {
        id: 4,
        title: "Misión 4 · Polialfabético en acción",
        description:
            "Cifra el mensaje BANANA con la clave KEY (cicla como K,E,Y,K,E,Y). La letra A aparece en las posiciones 2, 4 y 6. ¿A qué tres letras cifradas distintas se convierte la A en esas posiciones? Escríbelas juntas en orden, en mayúsculas.",
        answer: "EKY",
        hint:
            "Escribe BANANA como texto y KEY como clave en el cifrador de la lección. Fíjate en la fila 'Cifrado' del visualizador de ciclado — cada A aparece con una letra de clave distinta (E, K, Y) y produce un cifrado diferente. ¡Ese es el poder del cifrado polialfabético!"
    },
    {
        id: 5,
        title: "Misión 5 · Test de Kasiski",
        description:
            "Analizando un texto largo cifrado con Vigenère, encuentras que una misma secuencia de letras se repite. La distancia entre las dos primeras apariciones es 9, y entre la segunda y la tercera es 15. Según el método de Kasiski, ¿cuál es la longitud más probable de la clave?",
        answer: "3",
        hint:
            "El método de Kasiski calcula el Máximo Común Divisor (MCD) de las distancias entre repeticiones. MCD(9, 15) = ?"
    },
    {
        id: 6,
        title: "Misión 6 · Espacio de claves",
        description:
            "Un cifrado César con el alfabeto inglés tiene 26 claves posibles. ¿Cuántas claves posibles tiene un cifrado de Vigenère con una clave de exactamente 3 letras del mismo alfabeto?",
        answer: "17576",
        hint:
            "Cada una de las 3 posiciones de la clave puede ser cualquiera de las 26 letras, de forma independiente. El total es 26 × 26 × 26."
    }
];

export const methodMissionsConfig = {
    "one-time-pad": {
        missions: missions_one_time_pad,
        title: "Misiones · One-Time Pad",
        description: "Pon a prueba tus conocimientos sobre el One-Time Pad con estas misiones. Cada misión te desafiará a aplicar lo que has aprendido sobre este método de cifrado, desde operaciones bit a bit hasta conceptos clave de seguridad. ¡Acepta el reto y demuestra tu maestría en criptografía!"
    },
    "caesar": {
        missions: missions_caesar,
        title: "Misiones · César",
        description: "Desafía tu comprensión del cifrado César con estas misiones. Cada misión te llevará a explorar diferentes aspectos de este método clásico, desde descubrir claves hasta entender su funcionamiento con distintos alfabetos. ¡Acepta el reto y demuestra tu habilidad para descifrar mensajes secretos!"
    },
    "vigenere": {
        missions: missions_vigenere,
        title: "Misiones · Vigenère",
        description: "Pon a prueba tus conocimientos sobre el cifrado de Vigenère con estas misiones. Cada desafío te llevará a cifrar, descifrar y analizar mensajes usando claves cíclicas, desde operaciones básicas hasta conceptos clave del criptoanálisis polialfabético. ¡Demuestra que dominas la Tabula Recta!"
    }
};
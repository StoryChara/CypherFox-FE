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
    }
}
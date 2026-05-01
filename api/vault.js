export default function handler(req, res) {
    // Configuración CORS para permitir peticiones desde cualquier origen (ej. GitHub Pages)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-sovereign-email');

    // Manejar peticiones pre-flight (CORS)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Entregar la Llave Soberana (Apertura Total)
    const token = process.env.GITHUB_PAT;
    
    if (!token) {
        return res.status(500).json({ error: 'La bóveda está vacía. GITHUB_PAT no configurado en Vercel.' });
    }

    // Cabeceras de seguridad para evitar caché
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    return res.status(200).json({ token });
}

export default function handler(req, res) {
    // 1. Obtener la identidad de quien solicita acceso
    const userEmail = req.headers['x-sovereign-email'];
    const authorizedEmailsStr = process.env.AUTHORIZED_EMAILS || '';
    
    // Convertir la lista de emails autorizados en un array
    const authorizedEmails = authorizedEmailsStr.split(',').map(e => e.trim().toLowerCase());

    // 2. Validar credenciales
    if (!userEmail) {
        return res.status(401).json({ error: 'Identidad no proporcionada. Acceso denegado a la bóveda.' });
    }

    if (!authorizedEmails.includes(userEmail.toLowerCase())) {
        return res.status(403).json({ error: 'Identidad no autorizada. El Silo está cerrado.' });
    }

    // 3. Entregar la Llave Soberana
    const token = process.env.GITHUB_PAT;
    
    if (!token) {
        return res.status(500).json({ error: 'La bóveda está vacía. GITHUB_PAT no configurado en el servidor.' });
    }

    // Cabeceras de seguridad para evitar caché
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    return res.status(200).json({ token });
}

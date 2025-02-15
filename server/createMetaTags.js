import fs from 'fs'
import {getServerInfo} from './guilds/chatServer.js';

// for the client-side version this replaced, see https://github.com/Proto-Chat/chatJS-main/commit/715709f29182ecdde4711be32ec687bdee92ae50
export function createBaseMeta(res) {
	fs.readFile('./client/index.html', 'utf8', (err, html) => {
		if (err) {
			console.error(err);
			return res.status(500).send('Error reading the file');
		}

		const metaTags = `
            <meta property="og:title" content="Proto-Chat" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://chat.itamarorenn.com" />
            <meta property="og:image" content="https://github.com/Proto-Chat/chatJS-main/blob/server/client/assets/favicon.png?raw=true" />
            <meta property="og:description" content="The Discord clone that runs on RPI servers" />
            <meta name="theme-color" content="#8f8bbf">
            <meta name="twitter:card" content="summary_large_image">
        `;

		// Insert the meta tags into the HTML content
		const modifiedHtml = html.replace('</head>', `${metaTags}</head>`);

		// Send the modified HTML content
		res.send(modifiedHtml);
	});
}


export function createJoinMeta(res) {
	fs.readFile('./client/join.html', 'utf8', (err, html) => {
		if (err) {
			console.error(err);
			return res.status(500).send('Error reading the file');
		}

		const metaTags = `
            <meta property="og:title" content="Proto-Chat" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://chat.itamarorenn.com" />
            <meta property="og:image" content="https://github.com/Proto-Chat/chatJS-main/blob/server/client/assets/favicon.png?raw=true" />
            <meta name="description" content="Join us today! Sign up to become a member of our \"vibrant\" community. Enjoy exclusive access to our resources, participate in engaging discussions, and connect with like-minded individuals. Start your journey with us now on our Join page.">
            <meta name="theme-color" content="#8f8bbf">
            <meta name="twitter:card" content="summary_large_image">
        `;

		// Insert the meta tags into the HTML content
		const modifiedHtml = html.replace('</head>', `${metaTags}</head>`);

		// Send the modified HTML content
		res.send(modifiedHtml);
	});
}


export async function createServerMeta(mongoconnection, serverId, sessionid, res) {
	fs.readFile('./client/server.html', 'utf8', async (err, html) => {
		if (err) {
			console.error(err);
			return res.status(500).send('Error reading the file');
		}

		let metaTags = `
			<meta property="og:title" content="Proto-Chat" />
			<meta property="og:type" content="website" />
			<meta name="theme-color" content="#8f8bbf">
			<meta name="twitter:card" content="https://github.com/Proto-Chat/chatJS-main/blob/server/client/assets/favicon.png?raw=true">
			<meta property="og:image" content="https://github.com/Proto-Chat/chatJS-main/blob/server/client/assets/favicon.png?raw=true" />
		`;

		const sdoc = await getServerInfo(mongoconnection, sessionid, serverId, false, true);
		if (!sdoc || sdoc.code == 501) {
			metaTags += `
				<meta property="og:url" content="https://chat.itamarorenn.com" />
				<meta name="description" content="This server is private or does not exist!">
			`;
		}
		else {
			metaTags += `
				<meta property="og:url" content="https://chat.itamarorenn.com/server/${serverId}" />
				<meta name="description" content="click to view the \"${sdoc?.configs?.name}\" chat server!">
			`;
		}

		// Insert the meta tags into the HTML content
		const modifiedHtml = html.replace('</head>', `${metaTags}</head>`);

		// Send the modified HTML content
		res.send(modifiedHtml);
	});
}
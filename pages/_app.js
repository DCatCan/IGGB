import Layout from "@/components/Layout";
import Nav from "@/components/Nav";
import Genecontext from "@/context/GenomeHandler";
import "@/styles/globals.css";


export default function App({ Component, pageProps }) {
	return (
		<Genecontext>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</Genecontext>
	);
}

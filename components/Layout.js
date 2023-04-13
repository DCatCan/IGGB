import { createContext, useContext, useState } from "react";
import Nav from "./Nav";
import Genecontext from "@/context/GenomeHandler";

const Layout = (props) => {
	return (
		<>
			<Nav />
			{props.children}
		</>
	);
};

export default Layout;

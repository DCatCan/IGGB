import Layout from "@/components/Layout";
import { createContext, useState } from "react";

export const Genomehandler = createContext(null);

function Genecontext({ children }) {
	const [species, setSpecies] = useState(new Array());
	const [sharedGenomes, setSharedGenomes] = useState(new Array());
	const [orderedGenomes, setOrderGenomes] = useState(new Array());

	const handler = {
		getSpecies: () => {
			return species;
		},
		getShared: () => {
			return sharedGenomes;
		},
		getOrdered: () => {
			return orderedGenomes;
		},
		getGenomeSet: (x) => {
			return sharedGenomes[x];
		},
		setSpeciesInfo: (x) => {
			setSpecies(x)
		},
		setShared: (e) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				const res = reader.result.split("\n").map((row) => {
					return row.split("\t");
				});
				const spec = res.splice(0, 1).flat();

				spec.forEach((elem) =>
					setSpecies((existing) => [...existing, [elem, true]])
				);
				const sharedGenomes = [];
				for (let i = 0; i < res[0].length; i++) {
					const temp = [];
					temp.push(
						res.map((elem) => {
							return elem[i];
						})
					);
					sharedGenomes.push(temp.flat());
				}

				setSharedGenomes(sharedGenomes);
			};
			reader.readAsText(e.target.files[0]);
		},
		setOrder: (e) => {
			const reader = new FileReader();
			const name = e.target.files[0].name.replace(/[.]\w+/, "");
			const index = orderStuff(name);

			reader.onload = () => {
				const res = reader.result.split("\n").map((row) => {
					return row.split("\t");
				});
			};
			reader.readAsText(e.target.files[0]);
		},
		orderStuff: (x) => {
			if (sharedGenomes.length > 0) {
				let i = species.indexOf(x);
				if (i !== -1) {
					return i;
				} else {
					return false;
				}
			}
		},
	};

	return (
		<Genomehandler.Provider value={handler}>{children}</Genomehandler.Provider>
	);
}

export default Genecontext;

import Layout from "@/components/Layout";
import { createContext, useState } from "react";

export const Genomehandler = createContext(null);

function Genecontext({ children }) {
	const [species, setSpecies] = useState(new Array());
	const [sharedGenomes, setSharedGenomes] = useState(new Array());
	const [orderedGenomes, setOrderGenomes] = useState(new Array());
	const [activeIndeces, setActiveIndeces] = useState([]);
	const orderStuff = (x) => {
		if (sharedGenomes.length > 0) {
			const findSpeciesIndex = (elem) => elem[0] === x;
			const i = species.findIndex(findSpeciesIndex);
			const element = species[i];
			element[2] = true;
			console.log(element);
			setSpecies((existing) => [
				...existing.slice(0, i),
				element,
				...existing.slice(i + 1),
			]);
			return i;
		} else {
			return -1;
		}
	};
	const readFiles = (theFiles) => {
		const reader = new FileReader();
		let name = theFiles.name.replace(/[.]\w+/, "");
		let index = orderStuff(name);
		reader.onload = () => {
			const res = reader.result.split("\n").map((row) => {
				return row.split("\t");
			});
			const temp = [...orderedGenomes];
			if (index !== -1) {
				setOrderGenomes(existing => [
					...existing.slice(0,index),
					existing[index] = res,
					...existing.slice(index+1)
				]);
			}
		};
		reader.readAsText(theFiles);
	};

	const handler = {
		getSpecies: () => {
			return species;
		},
		getSpecificSpecies: (x) => {
			return species[x];
		},
		getShared: () => {
			return sharedGenomes;
		},
		getOrdered: () => {
			return orderedGenomes;
		},
		getIndeces: () =>{
			return activeIndeces;
		}
		,
		getOrderOf: (x) => {
			return orderedGenomes[x]
		},
		getGenomeSet: (x) => {
			return sharedGenomes[x];
		},
		setSpeciesInfo: (x) => {
			setSpecies(x);
		},
		clearShared: () => {
			setSharedGenomes([]);
			setSpecies([]);
			setActiveIndeces([]);
		},
		setShared: (e) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				const res = reader.result.split("\n").map((row) => {
					return row.split("\t");
				});
				const spec = res.splice(0, 1).flat();

				spec.forEach((elem, index) =>

					setSpecies((existing) => [...existing, [elem.match(/./g).join(''), true, false, index]])
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
		setActiveIndx: (x) => {
			setActiveIndeces([])
			x.forEach((element, index) => {
				const isActive = element[1];
				if (isActive) {
					setActiveIndeces(existing => [...existing, index]);
				}
			});
		},
		setOrder: (e) => {
			const theFiles = e.target.files;
			for (let index = 0; index < theFiles.length; index++) {
				const elem = theFiles[index];
				readFiles(elem);
			}

			// if (theFiles.length > 1) {
			// 	for (let ind = 0; ind < theFiles.length; ind++) {

			// 	}

			// } else {
			// 	readFiles(e.target.files[0])

			// }
		},
	};

	return (
		<Genomehandler.Provider value={handler}>{children}</Genomehandler.Provider>
	);
}

export default Genecontext;

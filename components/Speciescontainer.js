import { useEffect, useState, useContext } from "react";
import sps from "../styles/species.module.css";
import randomColor from "randomcolor";
import { Genomehandler } from "@/context/GenomeHandler";
import { stringify } from "postcss";

const Speciescontainer = ({
	setFilter,
	infoDisplay: infoDisplayFunction,
	filter,
}) => {
	const handler = useContext(Genomehandler);
	const sharedGenomes = handler.getShared();
	const speciesNames = handler.getSpecies();
	const activeSpecies = handler.getIndeces(); //indeces of the active species

	const [scrollVal, setScrollVal] = useState(10);
	const [speciesOut, setSpeciesOut] = useState([]);
	const [sharedIndeces, setSharedIndeces] = useState([]);
	const [info, setInfo] = useState();

	const color = randomColor({
		luminosity: "light",
		format: "rgb",
		count: parseInt(filter.maxGenes),
	});
	//-----------------------------------------------

	const re_arrangeFor = (species) => {};
	const orderIndeces = (focusedSet) => {
		//Order the indeces after the focused species.

		//remove genes that arent relevant
		const sharedGenesOnly = focusedSet.filter();
		console.log(sharedGenesOnly);

		//get the orderedFile that you added for this specific species.

		const IndecesPairs = [];
	};

	const swapElem = (array, index1, index2) => {
		[array[index1], array[index2]] = [array[index2], array[index1]];
	};

	useEffect(() => {
		function getActiveSpecies(x) {
			//picks out the species that were chosen
			const temp = [];
			x.forEach((element, index) => {
				const isActive = element[1];
				if (isActive) {
					temp.push(sharedGenomes[index]);
				}
			});
			return temp;
		}
		function rdyUp(speciesList) {
			const listSet = [];
			let startGene = parseInt(filter.GeneSelected);
			let speciesSelected = parseInt(filter.SpeciesSelected); // the index on the activeSpeciesList
			let maxGenes = parseInt(filter.maxGenes);

			for (let index = 0; index < speciesList.length; index++) {
				const ilement = speciesList[index];
				const currentSpecies = activeSpecies[index]; // current species Index

				let temp = [];
				let jndex = startGene;
				while (temp.length < maxGenes) {
					temp.push(ilement[jndex]);
					jndex++;
				}

				listSet.push(temp);
			}

			const sharedInd = new Array();

			// get the shared indeces to later re-arrange when we focus with orderedFile
			for (let i = startGene; i < startGene + maxGenes; i++) {
				sharedInd.push(i);
			}

			setSharedIndeces(sharedInd);

			console.log(activeSpecies);
			// list of genomes from a species
			//check if the species is the one thats focused and of it has ordered genes available
			const isFocus =
				currentSpecies === parseInt(filter.SpeciesSelected) ? true : false;
			//arrange the the focused genes in order (remember if they are in different chrm different colors)
			if (isFocus && orderIndeces[activeSpecies].length > 0) {
			}
			// create an indexList after with the same swaps as the focused one!

			return listSet;
		}

		if (speciesNames.length > 0) {
			const a1 = getActiveSpecies(speciesNames); // get the relevant species selected;
			const out = rdyUp(a1); // get the species rdy for display, shave away genomes that the speceis do not share
			setSpeciesOut(out);
		}

		return () => console.log("unmount Container class");
	}, [speciesNames, filter]);

	//-----------------------------------------------------------------------------------------------

	return (
		<div className={sps.speciesContainer}>
			{speciesOut.map((elem, index) => {
				let speciesInf = handler.getSpecificSpecies(activeSpecies[index]);
				return (
					<div
						className={sps.species}
						key={`s${index}`}>
						<div className={sps.speciesLabel}>
							<h3>{speciesInf[0]}</h3>
						</div>
						<Species
							key={`species${index}`}
							genes={elem}
							setFilter={setFilter}
							infoDisplay={infoDisplayFunction}
							filter={filter}
							OG={handler.getOrderOf(index)}
							color={color}
						/>
					</div>
				);
			})}
		</div>
	);
};

const Species = ({ genes, setFilter, infoDisplay, OG, filter, color }) => {
	const [relevantIndeces, setRelevantIndeces] = useState([]);
	useEffect(() => {
		const setAllIndeces = () => {
			const sharedGenesOnly = genes.filter(
				(elem) => elem !== "---" && elem !== "---\r"
			);
			console.log(sharedGenesOnly);

			sharedGenesOnly.forEach((elem) => {
				const isElem = (genomeSet) => genomeSet[0] === elem;
				const iTemp = OG.findIndex(isElem);

				console.log(iTemp);
				setRelevantIndeces(iTemp);
			});
		};
		if (OG) {
			setAllIndeces();
		}
		return () => console.log("unmount Species Class");
	}, [OG]);

	const getAreaGenes = (a, b, c) => {
		return [OG.slice(a, b), OG.slice(b, c)];
	};

	return (
		<div className={sps.species_container}>
			{genes.map((elem, index) => (
				<Genome
					gene={elem}
					key={index}
					color={color[index]}
					infoDisplay={infoDisplay}
					allIndeces={relevantIndeces}
				/>
			))}
		</div>
	);
};

function Genome({ gene, color, infoDisplay, allIndeces }) {
	const [out, setOut] = useState();
	useEffect(() => {
		if (gene.length > 0) {
			gene !== "---" && gene !== "---\r"
				? setOut(
						<button
							className={sps.genome}
							style={{ backgroundColor: color }}
							onClick={infoDisplay()}>
							<p>{gene}</p>
						</button>
				  )
				: setOut(
						<div
							className={sps.genome}
							style={{ backgroundColor: "rgba(0,0,0,0.1)" }}></div>
				  );
		}
	}, [gene]);

	return <div>{out}</div>;
}

export default Speciescontainer;

class Node {
	constructor(val) {
		this.value = val;
		this.left = null;
		this.right = null;
	}
}

class BST {
	constructor() {
		this.root = null;
	}
	insert(val) {
		const node = Node(val);
		this.root == null ? (this.root = node) : insertNode(this.root, node);
	}
	insertNode(n, newNode) {
		if (n.value < newNode.value) {
			n.left === null ? (n.left = newNode) : this.insertNode(n.left, newNode);
		} else {
			n.right === null
				? (n.right = newNode)
				: this.insertNode(n.right, newNode);
		}
	}
	remove(val) {
		this.root = this.removeNode(this.root, val);
	}
	removeNode(n, k) {
		if (n === null) {
			return null;
		} else if (k < n.value) {
			n.left = this.removeNode(n.left, k);
			return n;
		} else if (k > n.value) {
			n.right = this.removeNode(n.right, k);
			return n;
		} else {
			if (n.left === null && n.right === null) {
				n = null;
				return n;
			}
			if (n.left === null) {
				n = n.right;
				return n;
			} else if (n.right === null) {
				n = n.left;
				return n;
			}
			const minRight = this.findMinNode(n.right);
			n.value = minRight.value;
			n.right = this.removeNode(n.right, minRight.value);
			return n;
		}
	}
	findMinNode(node) {
		if (node.left === null) {
			return node;
		} else {
			return this.findMinNode(node.left);
		}
	}

	getRootNode() {
		return this.root;
	}

	inorder(node) {
		if (node !== null) {
			return this.inorder(node.left) + node.value + this.inorder(node.right);
		} else {
			return null;
		}
	}

	preorder(node) {
		if (node !== null) {
			return node + this.preorder(this.left) + this.preorder(this.right);
		} else {
			return null;
		}
	}

	postorder(node) {
		if (node !== null) {
			return (
				this.postorder(node.left) + this.postorder(node.right) + node.value
			);
		} else {
			return null;
		}
	}
}

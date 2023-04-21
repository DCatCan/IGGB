import { useEffect, useState } from "react";
import sps from "../styles/species.module.css";
import randomColor from "randomcolor";

const Speciescontainer = ({
	sharedGenomes,
	setFilter,
	speciesNames,
	indeces,
	infoDisplay,
	orderGenomes,
	filter,
}) => {
	const [scrollVal, setScrollVal] = useState(10);

	return (
		<div className={sps.speciesContainer}>
			{sharedGenomes.map((elem, index) => {
				return (
					<div
						className={sps.species}
						key={`s${index}`}>
						<div className={sps.speciesLabel}>
							<h3>{speciesNames[indeces[index]]}</h3>
						</div>
						<Species
						key={`species${index}`}
							genes={elem}
							setFilter={setFilter}
							infoDisplay={infoDisplay}
							filter={filter}
							OG={orderGenomes[index]}
						/>
					</div>
				);
			})}
		</div>
	);
};

const Species = ({ genes, setFilter, infoDisplay, OG, filter }) => {
	const color = randomColor();
	const [genesOut, SetGenesOut] = useState(genes);

	
	useEffect(() => {
		const makeTrees = () => {
			const allTrees = [];


			const sharedGenesOnly = genes.filter((elem) => elem !== "---" && elem !== "---\r");
			console.log(sharedGenesOnly);
		
			sharedGenesOnly.forEach(elem => {
				const isElem = genomeSet => genomeSet[0] === elem;
				const iTemp = OG.findIndex(isElem);
				console.log(iTemp);



			});
			return  allTrees;
		}
		if (OG) {
			makeTrees();
		}
		return () => console.log("Unmount");
	},[OG]);

	return (
		<div className={sps.species_container}>
			{genesOut.map((elem, index) => (
				<Genome
					gene={elem}
					key={index}
					color={color}
					infoDisplay={infoDisplay}
				/>
			))}
		</div>
	);
};

function Genome({ gene, color, infoDisplay, OG }) {
	const [moop, setMoop] = useState("hello");
	useEffect(() => {
		if (gene.length > 0) {
			gene !== "---" && gene !== "---\r" ? setMoop(
				<button
					className={sps.genome}
					style={{ backgroundColor: color }}
					onClick={infoDisplay()}>
					<p>{gene}</p>
				</button>
			) : setMoop(
				<div
					className={sps.genome}
					style={{ backgroundColor: "rgba(0,0,0,0.1)" }}></div>
			);
		}
	}, [gene]);


	return moop;
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

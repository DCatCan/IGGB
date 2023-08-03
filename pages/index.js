import { useContext, useEffect, useState } from "react";
import sps from "@/styles/species.module.css";
import { Genomehandler } from "@/context/GenomeHandler";
import Filter from "@/components/Filter";
import {
	orderRest,
	prepare,
	quickSort,
	randomColor,
} from "@/functions/ordering";

export default function Home() {
	const handler = useContext(Genomehandler);
	const infoLabels = [
		"NAME",
		"CHROMOSOME/CONTIG/SCAFFOLD NUMBER",
		"ORIENTATION",
		"POSITION",
		"COORDINATES",
		"START COORDINATE",
		"STOP COORDINATE",
		"ON/OFF",
		"SHORT NAME",
		"NOTES",
	];
	const [geneFilter, setGeneFilter] = useState({
		maxGenes: handler.getGenomeSet(0).length < 10 ? handler.getGenomeSet(0).length : 10,
		SpeciesSelected: "0",
		GeneSelected: "0",
		focusName: "",
	});
	const [pressed, setPressed] = useState(0);


	const [info, setInfo] = useState(null);
	const handleFilter = (e) => {
		e.preventDefault();
		for (let index = 0; index < e.target.length; index++) {
			const { name, value } = e.target[index];

			setGeneFilter((existing) => {
				return { ...existing, [name]: value };
			});
		}

	}

	const handleGeneButton = async (information, boolVar) => {
		if (boolVar) {
			setInfo(
				<div className={`${sps["GenInfo"]}`}>
					<div>
						{information.map((elem, i) => {
							return (
								<p key={i}>
									{infoLabels[i]} = {elem}
								</p>
							);
						})}
					</div>
					<button
						onClick={() => {
							setInfo();
						}}>
						Close
					</button>
				</div>
			);
		} else {
			setInfo();
		}
	};

	return (
		<div className={sps.container}>
			{info}
			<Speciescontainer
				setFilter={setGeneFilter}
				infoDisplay={handleGeneButton}
				filter={geneFilter}
				pressed={pressed}
			/>
			<Filter
				geneFilter={geneFilter}
				handleSubmit={handleFilter}
				setpressed={setPressed}
				pressed={pressed}
			/>
		</div>
	);
}

const Speciescontainer = ({ setFilter, infoDisplay, filter, pressed }) => {
	const handler = useContext(Genomehandler);
	const sharedGenomes = handler.getShared();
	const speciesNames = handler.getSpecies();
	const activeSpecies = handler.getIndeces(); //indeces of the active species
	const orderedGenomes = handler.getOrdered();
	//genes going out
	const [out, setOut] = useState([]);
	//color schemas
	const [colorDict, setColorDict] = useState({ focus: "#ffffff" });

	//-----------------------------------------------
	const generateColor = (info, index) => {
		let chr = Array.isArray(info) && info.length > 1 ? info[1] : index;
		let newColor = randomColor();

		if (chr in colorDict) {

			return colorDict[chr];
		} else {
			let colorExist = Object.values(colorDict).includes(newColor);
			while (colorExist) {
				// if the ame color is in the dictionary, change it.
				newColor = randomColor();
				colorExist = Object.values(colorDict).includes(newColor);
			}

			setColorDict((exist) => {
				return { ...exist, [chr]: newColor };
			});

			return newColor;
		}
	};

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
	//Organize the focused species

	const organizer = async (OutArray) => {
		//get the index for the pillar, which is mathed to the index of the oredered gene list

		let focusedList = OutArray[parseInt(filter.SpeciesSelected)];
		//get the corresponding gene order list
		const focusGeneOrder = orderedGenomes[parseInt(filter.SpeciesSelected)];

		const G = [];
		let G_un = [];
		focusedList.map((elem, index) => {
			if (elem !== "---" && elem !== "---\r") {
				G.push(focusGeneOrder.findIndex((el) => el[0] === elem));
			}
			const foundIndex =
				elem !== "---" && elem !== "---\r"
					? focusGeneOrder.findIndex((el) => el[0] === elem)
					: -1;
			G_un.push(foundIndex);
		});

		// QuickSort to sort the focused set.
		quickSort(G, 0, G.length - 1);

		// swapping the homologous genes around after the focused order
		await orderRest(OutArray, G, G_un);
	};
	const setInfo = (elem, OG) => {
		let details;

		if (Array.isArray(OG)) {
			if (elem !== "---" && elem !== "---\r") {
				details = OG.find((el) => el[0] === elem);
			} else {
				details = undefined;
			}
		} else {
			details = undefined;
		}
		return details ? details : [elem];
	};

	useEffect(() => {
		let temp = prepare(getActiveSpecies(speciesNames), filter);

		if (orderedGenomes[parseInt(filter.SpeciesSelected)]) {
			//organize the focused species to ge G
			organizer(temp);
		}
		console.log(pressed);
		setOut(temp)


	}, [filter]);


	//-----------------------------------------------------------------------------------------------

	return (
		<div className={sps.speciesContainer}>
			{out.map((speciesGenes, index) => {
				let speciesInf = handler.getSpecificSpecies(activeSpecies[index]);
				const chosenSpecies =
					index === parseInt(filter.SpeciesSelected) ? true : false;
				const chosenStyle = chosenSpecies ? sps.chosen : "";
				const OG = orderedGenomes[activeSpecies[index]];
				return (
					<div
						className={sps.species}
						key={`s${index}`}>
						<div className={`${sps.speciesLabel} ${chosenStyle}`}>
							<h3>
								{speciesInf[0]}
								{OG ? "*" : null}
							</h3>
						</div>
						<div className={`${sps.species_container} `}>
							{speciesGenes ? (speciesGenes.map((gene, ind) => {
								const tempInfo = setInfo(gene, OG);
								var tempColor;
								if (chosenSpecies && tempInfo[0] === filter.focusName) {
									tempColor = colorDict["focus"];
									console.log("inhere");
								} else {
									tempColor = generateColor(tempInfo, ind)
									console.log();
								}

								return (
									<Gene
										key={`${gene[0]} ${ind}`}
										color={tempColor}
										filter={filter}
										geneInfo={tempInfo}
										index={ind}
										speciesIndex={index}
										infoDisplay={infoDisplay}
									/>
								);
							})) : console.log(speciesGenes)}
						</div>
					</div>
				);
			})}
		</div>
	);
};


function Gene({ geneInfo, color, infoDisplay }) {
	const geneChro = geneInfo.length > 1 ? geneInfo[1] : "";
	return <div>{geneInfo.length > 0 ? (geneInfo[0] !== "---" && geneInfo[0] !== "---\r"
		?
		(
			< button
				className={sps.genome}
				style={{ backgroundColor: color }}
				onClick={async () => {
					const information = geneInfo;
					await infoDisplay(information, true);
				}}>
				<div>
					<p className="chr">{geneChro}</p>
					<p>{geneInfo[0]}</p>
				</div>
			</button>)
		:(
			<div
				className={sps.genome}
				style={{ backgroundColor: "rgba(0,0,0,0.1)" }}></div>
		)) : null}</div >;
}
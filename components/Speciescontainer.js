import { useEffect, useState, useContext } from "react";
import sps from "../styles/species.module.css";
import { Genomehandler } from "@/context/GenomeHandler";
import {
	orderRest,
	prepare,
	quickSort,
	randomColor,
} from "@/functions/ordering";

const Speciescontainer = ({ setFilter, infoDisplay, filter }) => {
	const handler = useContext(Genomehandler);
	const sharedGenomes = handler.getShared();
	const speciesNames = handler.getSpecies();
	const activeSpecies = handler.getIndeces(); //indeces of the active species
	const orderedGenomes = handler.getOrdered();

	// const [out, setOut] = useState(
	// 	prepare(getActiveSpecies(speciesNames), filter)
	// );
	const [out, setOut] = useState([]);
	//color schemas
	const [colorDict, setColorDict] = useState([]);

	//-----------------------------------------------
	const generateColor = (info, index) => {
		let chr = Array.isArray(info) && info.length > 1? info[1] : index;
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

	const organizer = (OutArray) => {
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
		orderRest(OutArray, G, G_un);
	};
	const setInfo = (elem, OG) => {
		let details;

		if (Array.isArray(OG)) {
			if (elem !== "---" && elem !== "---\r") {
				details = OG.find((el) => el[0] === elem);
			} else {
				details = undefined;
			}
		}else{
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
		setOut(temp);
		console.log(orderedGenomes);


		return () => {
		};
	}, [filter]);


	//-----------------------------------------------------------------------------------------------

	return (
		<div className={sps.speciesContainer}>
			{out.map((speciesGenes, index) => {
				let speciesInf = handler.getSpecificSpecies(activeSpecies[index]);
				const chosen =
					index === parseInt(filter.SpeciesSelected) ? true : false;
				const chosenStyle = chosen ? sps.chosen : "";
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
							{speciesGenes.map((gene, ind) => {
								const tempInfo = setInfo(gene, OG);
								return (
									<Gene
										key={`${gene[0]} ${ind}`}
										color={generateColor(tempInfo, ind)}
										filter={filter}
										geneInfo={tempInfo}
										index={ind}
										infoDisplay={infoDisplay}
									/>
								);
							})}
						</div>
						{/* <Species
							key={`species${index}`}
							geneList={speciesGenes}
							infoDisplay={infoDisplay}
							filter={filter}
							OG={orderedGenomes[activeSpecies[index]]}
							generateColor={generateColor}
						/> */}
					</div>
				);
			})}
		</div>
	);
};

// const Species = ({ geneList, generateColor, infoDisplay, OG, filter }) => {
// 	const setColor = (info, index) => {
// 		return generateColor(info, index);
// 	};
// 	const setInfo = (elem) => {
// 		let details;

// 		if (OG) {
// 			if (elem !== "---" && elem !== "---\r") {
// 				const indexOfgene = OG.findIndex((el) => el[0] === elem);
// 				details = OG[indexOfgene];
// 			} else {
// 				details = undefined;
// 			}
// 		}
// 		return details ? details : [elem];
// 	};

// 	const generateOut = () => {
// 		return geneList.map((elem, index) => {
// 			const tempInfo = setInfo(elem);
// 			const color = setColor(tempInfo, index);
// 			return (
// 				<Gene
// 					key={index}
// 					color={color}
// 					infoDisplay={infoDisplay}
// 					geneInfo={tempInfo}
// 					index={index}
// 					filter={filter}
// 				/>
// 			);
// 		});
// 	};
// 	const [out, setOut] = useState(generateOut());

// 	return <div className={`${sps.species_container} `}>{out}</div>;
// };

function Gene({ geneInfo, color, infoDisplay, index, filter }) {
	const [out, setOut] = useState();

	useEffect(() => {
		if (geneInfo.length > 0) {
			geneInfo[0] !== "---" && geneInfo[0] !== "---\r"
				? setOut(() => {
						const geneChro = geneInfo.length > 1 ? geneInfo[1] : "";
						return (
							<button
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
							</button>
						);
				  })
				: setOut(
						<div
							className={sps.genome}
							style={{ backgroundColor: "rgba(0,0,0,0.1)" }}></div>
				  );
		}
	}, [geneInfo]);

	return <div>{out}</div>;
}

export default Speciescontainer;

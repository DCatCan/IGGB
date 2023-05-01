import { useContext, useEffect, useState } from "react";
import sps from "@/styles/species.module.css";
import { Genomehandler } from "@/context/GenomeHandler";
import Speciescontainer from "@/components/Speciescontainer";
import Filter from "@/components/Filter";

export default function Home() {
	const handler = useContext(Genomehandler);
	const [geneFilter, setGeneFilter] = useState({
		maxGenes: 5,
		SpeciesSelected: 0,
		GeneSelected: 0,
	});

	const [info, setInfo] = useState();

	const handleGeneButton = (information, boolVar) => {
		//temp, fix it back!

		if (boolVar) {
			setInfo(
				<div className={`${sps["GenInfo"]}`}>
					{information.map((elem, i) => {
						return (
							<p key={i}>
								{infoLabels[i]} = {elem}
							</p>
						);
					})}
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
			/>
			<Filter
				geneFilter={geneFilter}
				setFilter={setGeneFilter}
			/>
		</div>
	);
}

const infoLabels = [
	"Position",
	"NAME",
	"ORIENTATION",
	"START COORDINATE",
	"STOP COORDINATE",
	"ON/OFF",
	"CHROMOSOME/CONTIG/SCAFFOLD NUMBER",
	"SHORT NAME",
	"COORDINATES",
	"NOTES",
];

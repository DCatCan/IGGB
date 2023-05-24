import { useContext, useEffect, useState } from "react";
import sps from "@/styles/species.module.css";
import { Genomehandler } from "@/context/GenomeHandler";
import Speciescontainer from "@/components/Speciescontainer";
import Filter from "@/components/Filter";

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
		maxGenes: 15,
		OrganizeGenes: "false",
		SpeciesSelected: 0,
		GeneSelected: 0,
	});

	const [info, setInfo] = useState(null);

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
			/>
			<Filter
				geneFilter={geneFilter}
				setFilter={setGeneFilter}
			/>
		</div>
	);
}

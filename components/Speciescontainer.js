import { useEffect, useState } from "react";
import sps from "../styles/species.module.css";
import randomColor from "randomcolor";

const Speciescontainer = ({
	sharedGenomes,
	setFilter,
	speciesNames,
	indeces,
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
							genes={elem}
							setFilter={setFilter}
						/>
					</div>
				);
			})}
		</div>
	);
};

const Species = ({ genes, setFilter }) => {
	const color = randomColor();
	return (
		<div className={sps.species_container}>
			{genes.map((elem, index) => (
				<Genome
					gene={elem}
					setFilter={setFilter}
					key={index}
					color={color}
				/>
			))}
		</div>
	);
};

function Genome({ gene, setFilter, color }) {
	const out =
		gene !== "---" && gene !== "---\r" ? (
			<button
				className={sps.genome}
				style={{ backgroundColor: color }}>
				<p>{gene}</p>
			</button>
		) : (
			<div
				className={sps.genome}
				style={{ backgroundColor: "rgba(0,0,0,0.1)" }}></div>
		);
	return out;
}

export default Speciescontainer;

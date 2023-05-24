import { useState, useContext, useEffect, useRef } from "react";
import sps from "@/styles/species.module.css";
import Image from "next/image";
import arrow from "@/public/down-arrow.png";
import { Input } from "postcss";
import { Genomehandler } from "@/context/GenomeHandler";

function Filter({ geneFilter, setFilter }) {
	const [active, setActive] = useState(false);
	const ContainerClass = active ? sps.hide : null;
	const buttonClass = active ? sps.up : null;
	const handleHide = () => {
		setActive(!active);
	};

	return (
		<div className={`${ContainerClass} ${sps.filterContainer}`}>
			<button
				className={`${sps.filterActivation}`}
				onClick={handleHide}>
				<span className={`${buttonClass}`}>
					<Image
						src={arrow}
						alt=">"></Image>
				</span>
			</button>

			{
				<FormFilter
					geneFilter={geneFilter}
					setFilter={setFilter}
				/>
			}
		</div>
	);
}

function FormFilter({ geneFilter, setFilter }) {
	const handler = useContext(Genomehandler);
	const [genes, setGenes] = useState([]);
	const [species, setSpecies] = useState([]);
	const speciesRef = useRef(null);
	const handleSpeciesChange = (e) => {
		const { value } = e.target;
		setGenes(handler.getGenomeSet(value));
	};

	useEffect(() => {
		const handleAddedData = () => {
			setSpecies(handler.getSpecies().filter((elem) => elem[1]));
		};
		if (handler.getSpecies().length > 0) {
			handleAddedData();
		}
	}, [handler.getShared()]);
	useEffect(() => {
		if (species.length > 0 || genes.length > 0) {
			const value = species[0][3];
			setGenes(handler.getGenomeSet(value));
		}
	}, [species]);

	const handleSubmit = (e) => {
		e.preventDefault();
		for (let index = 0; index < e.target.length - 1; index++) {
			const { name, value } = e.target[index];

			setFilter((existing) => {
				return { ...existing, [name]: value };
			});
		}
	};

	return (
		<>
			<form
				className={sps.filterForm}
				onSubmit={handleSubmit}>
				<div className={sps.maxGenes}>
					<label htmlFor="maxGenes">Max. Output</label>
					<input
						type="number"
						name="maxGenes"
						id="maxGenes"
						min={1}
						defaultValue={geneFilter.maxGenes}
						className={sps.maxOutput}
					/>
				</div>
				<div className={sps.organize}>
					<label htmlFor="OrganizeGenes">Order Genes</label>
					<input
						type="checkbox"
						name="OrganizeGenes"
						id="OrganizeGenes"
						value={false}
						onChange={(e) => e.target.value = e.target.checked ? true : false }
					/>
				</div>

				<div className={sps.SpeciesSelected}>
					<label htmlFor="SpeciesSelected">Focus Species:</label>
					<select
						name="SpeciesSelected"
						id="SpeciesSelected"
						className={sps.SpeciesSelected}
						onChange={handleSpeciesChange}
						ref={speciesRef}>
						{species.map((elem, index) => {
							return (
								<option
									value={elem[3]}
									key={`SpeciesSel${index}`}>
									{elem[0]}
								</option>
							);
						})}
					</select>
				</div>
				<div className={sps.GeneSelected}>
					<label htmlFor="GeneSelected">Gene To focus</label>
					<select
						name="GeneSelected"
						id="GeneSelected">
						{genes.map((elem, index) =>
							elem !== "---" ? (
								<option
									value={index}
									key={`GeneSelected${index}`}>
									{elem}
								</option>
							) : null
						)}
					</select>
				</div>

				<button
					type="submit"
					className={sps.filterSubmit}>
					Filter
				</button>
			</form>
		</>
	);
}

export default Filter;

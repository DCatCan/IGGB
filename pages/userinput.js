import { useContext, useEffect, useState } from "react";
import { Genomehandler } from "@/context/GenomeHandler";
import { useRouter } from "next/router";
import is from "@/styles/Inputs.module.css";

const Userinput = () => {
	const handler = useContext(Genomehandler);
	const [speciesInfo, setSpeciesInfo] = useState(handler.getSpecies());
	const router = useRouter();
	const [positive,setPositive] = useState(true)

	const handleSpeciesSubmit = (e) => {
		e.preventDefault();
		handler.setSpeciesInfo(speciesInfo);
		handler.setActiveIndx(speciesInfo);
		router.push("/");
	};

	const handleClear = (e) => {
		e.preventDefault();
		handler.clearShared();
		setSpeciesInfo([]);
	};

	const handlePillars = (e) => {
		handler.setShared(e)
		setPositive(false)
		
	}
	useEffect(()=> {
		setSpeciesInfo(handler.getSpecies())



	},[handler.getSpecies()])

	return (
		<>
			<form
				id={is["file-upload"]}
				onSubmit={handleSpeciesSubmit}>
				<div className={is.input_container}>
					<div className={is.square}>
						<h2>Pillar File</h2>
						<input
							type="file"
							name="sharedRef"
							id="sharedInput"
							onChange={handlePillars}
						/>
					</div>
					<div className={is.square}>
						<h2>Ordered File/Files</h2>
						<br />
						<p>Multiple files allowed at a time</p>
						<input
							type="file"
							name="orderRef"
							id="orderInput"
							multiple={true}
							onChange={(e) => handler.setOrder(e)}
							disabled={positive}
						/>
					</div>
				</div>
				<div className={is.genedisplay}>
					<div className={is.speciesDisp}>
						{
							<DisplayInput
								speciesInfo={speciesInfo}
								setSpeciesInfo={setSpeciesInfo}
							/>
						}
					</div>
					<div className={is.buttonContainer}>
						<button onClick={handleClear}>Clear</button>
						<button type="submit">Submit</button>
					</div>
				</div>
			</form>
		</>
	);
};
// handle drag events
// const handleDrag = function (e) {
// 	e.preventDefault();
// 	e.stopPropagation();
// 	if (e.type === "dragenter" || e.type === "dragover") {
// 		setDragActive(true);
// 	} else if (e.type === "dragleave") {
// 		setDragActive(false);
// 	}
// };

function DisplayInput({ speciesInfo, setSpeciesInfo }) {
	return (
		<>
			{speciesInfo.map((elem, i) => (
				<SpeciesName
					key={i}
					index={i}
					setSpeciesInfo={setSpeciesInfo}
					speciesInfo={elem}
				/>
			))}
		</>
	);
}

function SpeciesName({ index, speciesInfo, setSpeciesInfo }) {
	const pClass = speciesInfo[1] ? is.marked : null;
	const handleClick = () => {
		setSpeciesInfo((existingItems) => {
			const element = [speciesInfo[0], !speciesInfo[1], speciesInfo[2]];
			return [
				...existingItems.slice(0, index),
				element,
				...existingItems.slice(index + 1),
			];
		});
	};

	return (
		<>
			<p
				className={pClass}
				key={index}
				onClick={handleClick}>
				{index}
				{". "}
				{speciesInfo[0]}
				{speciesInfo[2] ? " * " : null}
			</p>
		</>
	);
}

export default Userinput;

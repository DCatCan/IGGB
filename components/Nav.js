import { useState } from "react";
import { Router, useRouter } from "next/router";
import ns from "@/styles/Nav.module.css";
import Link from "next/link";

const Nav = (props) => {
	const router = useRouter();
	const handleClick = (e) => {
		e.preventDefault();
		router.push(e.target.href);
	};
	return (
		<>
			<nav className={ns["nav"]}>
				<ul>
					<li>
						<Link
							href="/"
							onClick={handleClick}>
							Home
						</Link>
					</li>
					<li>
						<Link
							href="/Userinput"
							onClick={handleClick}>
							Input
						</Link>
					</li>
				</ul>
			</nav>
		</>
	);
};

export default Nav;

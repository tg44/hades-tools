import {NextPage} from "next";
import {
	AppBar,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	css,
	CssBaseline,
	Grid,
	IconButton,
	Menu,
	MenuItem,
	Toolbar,
	Typography,
} from "@mui/material";
import Link from "next/link";
import {useState} from "react";
import MUILink from "@mui/material/Link";

import MenuIcon from "@mui/icons-material/Menu";
import Layout, {pages} from "../components/Layout";

const Home: NextPage = () => {
	return (
		<Layout pages={pages}>
			<div>
				<div>
					<Typography
						component="h1"
						variant="h2"
						align="center"
						color="textPrimary"
						gutterBottom
					>
						Hades tools
					</Typography>
					<Typography
						variant="h6"
						align="center"
						color="textSecondary"
						paragraph
					>
						This is a project to give small tools for{" "}
						<MUILink
							href="http://www.hadesstar.com/"
							target="_blank"
							rel="noreferrer"
						>
							Hades Star
						</MUILink>{" "}
						players. This website is build in to extend the{" "}
						<MUILink
							href="https://hs-compendium.com/"
							target="_blank"
							rel="noreferrer"
						>
							Hades Star Compedium
						</MUILink>{" "}
						app, and the game itself. If you have a tool recommendation, please
						write an issue to our{" "}
						<MUILink
							href="https://github.com/tg44/hades-tools/issues"
							target="_blank"
							rel="noreferrer"
						>
							github page
						</MUILink>
						.
					</Typography>
				</div>
			</div>
			<div>
				{/* End hero unit */}
				<Grid container spacing={2}>
					{pages.map((card) => (
						<Grid item key={card.name} sm={12} md={6} lg={3}>
							<Card
								style={{
									height: "100%",
									minWidth: "100%",
									display: "flex",
									flexDirection: "column",
								}}
							>
								<CardContent style={{flexGrow: 1}}>
									<Typography gutterBottom variant="h5" component="h2">
										{card.name}
									</Typography>
									<Typography>{card.description}</Typography>
								</CardContent>
								<CardActions>
									<Link href={card.link} passHref>
										<Button size="small" color="primary">
											GO
										</Button>
									</Link>
								</CardActions>
							</Card>
						</Grid>
					))}
				</Grid>
			</div>
		</Layout>
	);
};

export default Home;

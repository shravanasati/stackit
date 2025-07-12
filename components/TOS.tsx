"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sections = [
	{
		title: "Platform vs. Publisher",
		content:
			"StackIt is a platform for user-generated content designed to support collaborative learning and structured knowledge sharing. Any questions, answers, or other content posted on StackIt do not represent the views or opinions of StackIt or its developers. Users are solely responsible for the content they post, and we encourage respectful and constructive contributions to maintain a positive community environment.",
	},
	{
		title: "User Roles and Responsibilities",
		content:
			"StackIt supports three user roles: Guests, who can view all questions and answers; Users, who can register, log in, post questions and answers, and vote on content; and Admins, who can moderate content to ensure it aligns with our community guidelines. All users are expected to adhere to these Terms of Service and contribute to a respectful and inclusive learning environment.",
	},
	{
		title: "Content Moderation and Community Standards",
		content:
			"StackIt is committed to fostering a safe and respectful community for collaborative learning. We reserve the right to monitor, moderate, and remove any content that violates our community standards, including but not limited to offensive, harmful, or inappropriate material. Users are encouraged to report any content that violates these standards to help maintain a positive and productive platform.",
	},
	{
		title: "Data and Privacy",
		content:
			"StackIt values your privacy. We collect only the data necessary to provide and improve our services, such as user registration details and activity logs for registered Users. Guest activity is not personally identifiable. We implement reasonable measures to protect your data, but users are responsible for safeguarding their account credentials. For more details, please review our Privacy Policy.",
	},
	{
		title: "No Affiliation",
		content:
			"StackIt is an independent platform and is not affiliated, endorsed, or associated with any educational institution, organization, or entity unless explicitly stated. All content shared on StackIt is the sole responsibility of the individual users and does not reflect the views of any external entities.",
	},
	{
		title: "User Conduct and Termination",
		content:
			"Users are expected to engage respectfully and constructively on StackIt. Any behavior that disrupts the community, including harassment, spamming, or posting illegal content, may result in the suspension or termination of a user’s account at the discretion of StackIt administrators. We reserve the right to enforce these terms to protect the integrity of the platform.",
	}
];

export function TOS() {
	const router = useRouter();

	return (
		<div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
			<Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800 text-zinc-50">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">
						Terms of Service
					</CardTitle>
					<p className="text-zinc-400">
						Collaborative Learning with Responsibility.
					</p>
				</CardHeader>
				<CardContent className="space-y-6">
					{sections.map((section, index) => (
						<section key={index}>
							<h2 className="text-xl font-bold mb-2">{section.title}</h2>
							<p className="text-zinc-400">{section.content}</p>
						</section>
					))}
					<div className="flex justify-center mt-6">
						<Button variant="secondary" onClick={() => router.back()}>
							Go Back
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
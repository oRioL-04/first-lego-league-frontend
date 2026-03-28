import { ScientificProjectsService } from "@/api/scientificProjectApi";
import PageShell from "@/app/components/page-shell";
import { serverAuthProvider } from "@/lib/authProvider";
import { ScientificProject } from "@/types/scientificProject";

function ScientificProjectCard({ project, index }: Readonly<{ project: ScientificProject; index: number }>) {
    return (
        <div className="list-card block h-full pl-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 space-y-2">
                    <div className="list-kicker">Scientific Project #{index + 1}</div>
                    <div className="list-title">
                        {project.comments ? project.comments : `Project ${index + 1}`}
                    </div>
                    {project.score !== undefined && project.score !== null && (
                        <div className="list-support">Score: {project.score}</div>
                    )}
                </div>
                {project.score !== undefined && project.score !== null && (
                    <div className="status-badge">{project.score} pts</div>
                )}
            </div>
        </div>
    );
}

export default async function ScientificProjectsPage() {
    let projects: ScientificProject[] = [];
    let error: string | null = null;

    try {
        const service = new ScientificProjectsService(serverAuthProvider);
        projects = await service.getScientificProjects();
    } catch (e) {
        console.error("Failed to fetch scientific projects:", e);
        error = "Failed to load scientific projects.";
    }

    return (
        <PageShell
            eyebrow="Innovation project"
            title="Scientific Projects"
            description="Explore innovation projects linked to each FIRST LEGO League edition."
        >
            <div className="space-y-6">
                <div className="space-y-3">
                    <div className="page-eyebrow">Project list</div>
                    <h2 className="section-title">Season projects overview</h2>
                    <p className="section-copy max-w-3xl">
                        Each card highlights the scientific project submitted by a team, including score and evaluation comments.
                    </p>
                </div>

                {error && (
                    <p className="border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                        {error}
                    </p>
                )}

                {!error && projects.length === 0 && (
                    <p className="border border-border bg-background/80 px-4 py-3 text-sm text-muted-foreground">
                        No scientific projects found.
                    </p>
                )}

                <ul className="list-grid">
                    {projects.map((project, index) => (
                        <li key={project.uri ?? index}>
                            <ScientificProjectCard project={project} index={index} />
                        </li>
                    ))}
                </ul>
            </div>
        </PageShell>
    );
}
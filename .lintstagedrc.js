import path from "node:path";

const repoRoot = path.resolve(".");

function rel(file) {
  return path.relative(repoRoot, file);
}

function splitByPackage(files) {
  const groups = { backend: [], frontend: [] };
  for (const f of files) {
    const r = rel(f);
    if (r.startsWith("backend/")) groups.backend.push(r.slice("backend/".length));
    else if (r.startsWith("frontend/")) groups.frontend.push(r.slice("frontend/".length));
  }
  return groups;
}

export default {
  "{backend,frontend}/src/**/*.{js,jsx}": (files) => {
    const { backend, frontend } = splitByPackage(files);
    const cmds = [];
    if (backend.length) {
      cmds.push(`bash -c "cd backend && npx eslint --fix ${backend.map((f) => `'${f}'`).join(" ")}"`);
    }
    if (frontend.length) {
      cmds.push(`bash -c "cd frontend && npx eslint --fix ${frontend.map((f) => `'${f}'`).join(" ")}"`);
    }
    cmds.push(`npx prettier --write ${files.map((f) => `'${rel(f)}'`).join(" ")}`);
    return cmds;
  },
  "{backend,frontend}/src/**/*.{css,json,md}": (files) =>
    `npx prettier --write ${files.map((f) => `'${rel(f)}'`).join(" ")}`,
};

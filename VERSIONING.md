# Versioning Strategy

## Automatic Versioning

Versions are automatically bumped when code is merged to `main` based on commit message prefixes:

- `fix:` → Patch (0.0.X)
- `feat:` → Minor (0.X.0)
- `feat!:` or `BREAKING CHANGE:` → Major (X.0.0)
- No prefix or `chore:`, `docs:`, `style:` → No version bump

## Docker Versioning

**Main branch:**
```
myapp:1.2.3 (from package.json)
myapp:latest
```

**Feature branches:**
```
myapp:feature-name-abc1234 (branch + commit SHA)
```

## Template Repository Setup

This is a template repository. When creating a new project from this template:

1. Start with version `0.0.0` in `package.json`
2. The versioning workflow is ready to use
3. First `feat:` commit will bump to `1.0.0`

**To disable versioning in this template repo:**
- Don't use `feat:` or `fix:` commit prefixes
- Or disable the GitHub Actions workflow

const GitHub = require('github-api');

class PrBranchFinder {
    constructor(githubUser, githubRepo) {
        this.github = new GitHub();
        this.repo = this.github.getRepo(githubUser, githubRepo);
    }

    async findForTag(tagName) {
        const tagCommitSha = (await this._getTagCommit(tagName)).sha;
        const parentCommitSha = (await this._getParentCommit(tagCommitSha)).parents[0].sha;

        const { head: { ref } } = await this._getCorrespondingPr(parentCommitSha, tagCommitSha, tagName);
        return ref;
    }

    async _getTagCommit(tagName) {
        const { data: singleCommit } = await this.repo.getSingleCommit(tagName);
        if (!singleCommit) {
            throw new Error(`Can't find tag's commit: ${tagName}`);
        }

        return singleCommit;
    }

    async _getParentCommit(sha) {
        return (await this.repo.getCommit(sha)).data;
    }

    async _getCorrespondingPr(sha, tagCommitSha, tagName) {
        const {data: prs} = await this.repo.listPullRequests({ state: 'closed', sort: 'updated', direction: 'desc' });
        const foundPr = prs.find(pr => pr.merge_commit_sha === sha);

        if (!foundPr) {
            throw new Error(`Can't find PR. Tag's commit's sha: ${tagCommitSha},  parent's sha: ${sha},  tag's name: ${tagName}`);
        }

        return foundPr;
    }
}

async function main() {
    const prBranchFinder = new PrBranchFinder('Activiti', 'activiti-modeling-app'),
        [ bin, sourcePath, tagName ] = process.argv;

    if (!tagName.match(/^v[0-9]*\.[0-9]*\.[0-9]*$/)) {
        throw new Error(`Tag name is not correct: ${tagName}`);
    }

    return await prBranchFinder.findForTag(tagName);
}

main()
.then(branchName => console.log(branchName))
.catch(error => {
    console.error(error.message);
    process.exit(1);
});

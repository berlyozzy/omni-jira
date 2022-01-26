import { readable } from 'svelte/store';

export const help_commands = readable([
    {
        text : "<span> <p> Open <b>any Jira instance</b> by typing</p> <pre><code>jira [instance tag]</code></pre>  </span>",
        copy : "jira MYINSTANCE"
    },
    {
        text : "<span> <p> Open <b>any Jira ticket</b> by typing</p> <pre><code>jira [issue key]</code></pre>  </span>",
        copy : "jira MYPROJECT-1"
    },
    {
        text : "<span> <p> Open <b>any Jira project</b> by typing</p> <pre><code>jira p [project key]</code></pre>  </span>",
        copy : "jira p MYPROJECT"
    },
    {
        text : "<span> <p> <b>Search</b> through any Jira instance <b>via basic search</b></p> <pre><code>jira [project key] [keywords]</code></pre>  </span>",
        copy : "jira MYPROJECT setup a meeting"
    },
    {
        text : "<span> <p> <b>Search</b> through any Jira instance <b>via JQL</b></p> <pre><code>jira [project key] jql [JQL query]</code></pre>  </span>",
        copy : "jira MYINSTANCE jql project=MYPROJECT AND assignee in (EMPTY)"
    },
    {
        text : "<span> <p> Have <b>quick access</b> to your <b>saved filters</b></p> <pre><code>jira filter [custom tag or ID]</code></pre>  </span>",
        copy : "jira filter 00000"
    },
    {
        text : "<span>   <p> <b>Add</b> as many <b>Jira instances</b> as you'd need </p> </span>",
        copy : "https://example.com/",
        external : true
    },
    {
        text : "<span>   <p> <b>Save</b> as many <b>filters</b> as you'd need </p> </span>",
        copy : "https://example.com/",
        external : true
    },
    {
        text : "<span>   <p> <b>Access</b> up-to <b>10 previously open</b> Jira tickets </p> </span>",
        copy : "https://example.com/",
        external : true
    },
    {
        text : "<span>   <p> Use <b>shortcuts</b> to get where you need to be faster </p> </span>",
        copy : "https://example.com/",
        external : true
    },
    {
        text : "<span>   <p> <b>Export/Import</b> your <b>preferences</b> to share with colleagues at any time </p> </span>",
        copy : "https://example.com/",
        external : true
    }    
])

export const Copy = (text) => {
    navigator.clipboard.writeText(text).then(() => {console.log(`Copied: ${text}`)}, () => {console.log(`Failed to copy: ${text}`)});
}

export const OpenExternal = (text) => {
    chrome.tabs.create({ url: text });
}
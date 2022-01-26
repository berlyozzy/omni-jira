let raw_filters = [];
let filter_ids = [];
let filter_tags = [];

async function getLocalStorageValue(key) {
	return new Promise((resolve) => {
		chrome.storage.sync.get(key, function (value) { resolve(value) })
	});
}

chrome.omnibox.onInputChanged.addListener( async (text, suggest) => {

	if(text.startsWith('filter')){

		raw_filters = (await getLocalStorageValue('JiraFilters')).JiraFilters;
		raw_filters = raw_filters === undefined ? [] : raw_filters;

		if(raw_filters.length === 0){ return }

		const input = text.replace('filter', '').trim();
		const isNumber = input.match(/^-?\d+$/) ? true : false;

		if(isNumber){

			filter_ids = raw_filters.map(e => {return {
				content : `${e.instance.endsWith('/') ? e.instance.slice(0, -1) : e.instance}/issues/?filter=${e.id}`,
				description : e.id
			}});

			const display_ids = filter_ids.filter(e => e.description.includes(input));

			suggest(display_ids)
		}else{

			filter_tags = raw_filters.map(({instance, id, filter_tag}) => {return {
				content : `${instance.endsWith('/') ? instance.slice(0, -1) : instance}/issues/?filter=${id}`,
				description : filter_tag
			}});

			const display_tags = filter_tags.filter(({description}) => description.toUpperCase().includes(input.toUpperCase()));

			suggest(display_tags)
		}

	}else{
		
		const instances = (await getLocalStorageValue('JiraInstances')).JiraInstances;

		if(instances === undefined){
	
			chrome.storage.sync.set({JiraInstances : []});

		}else{

			const suggestions = instances.map(({content, description}) => {
				return {
					content : content,
					description : description
				}
			})

			suggest(suggestions);

		}

	}

});
  
chrome.omnibox.onInputEntered.addListener( async (input) => {

	if(input.startsWith('filter')){

		if(raw_filters.length === 0){ return }

		const filter = input.replace('filter', "").trim();
		const isNumber = /^-?\d+$/.test(filter);

		if(isNumber){

			filter_ids = filter_ids.length == 0 ? raw_filters.map(({instance, id}) => {return {
				content : `${instance.endsWith('/') ? instance.slice(0, -1) : instance}/issues/?filter=${id}`,
				description : id
			}}) : filter_ids;

			const saved = filter_ids.findIndex(({description}) => description == filter);

			if(saved != -1){
				chrome.tabs.create({ url: filter_ids[saved].content });
			}else{
				chrome.search.query({text: input});
				return
			}

		}else{

			filter_tags = filter_tags.length == 0 ? raw_filters.map(({instance, id, filter_tag}) => {return {
				content : `${instance.endsWith('/') ? instance.slice(0, -1) : instance}/issues/?filter=${id}`,
				description : filter_tag
			}}) : filter_tags;

			const saved = filter_ids.findIndex(({description}) => description.toUpperCase() == filter.toUpperCase());

			if(saved != -1){
				chrome.tabs.create({ url: filter_tags[saved].content });
			}else{
				chrome.search.query({text: input});
				return
			}

		}

	}else{

		const instances = (await getLocalStorageValue('JiraInstances')).JiraInstances;

		let url = "";
		input = input.trim();
	
		if(input.match(/^https:\/\/(.*?)/g)){

			url = input

		}else if(input.includes("-")){

			const result = instances.filter(instance => instance.projects.join("") != "" && instance.projects.some(i => input.toUpperCase().includes(i)))
	
			if(result.length == 0){
				chrome.search.query({text : input});
				return
			}else{
				url = `${result[0].content.endsWith('/') ? result[0].content.slice(0, -1) : result[0].content}/browse/${input.toUpperCase()}`;
			}

		}else{
	
			const keywords = input.split(" ");
			let text = input.replace(keywords[0], "").trim();

			if(keywords[0].toUpperCase() == "P"){

				const result = instances.filter(instance => instance.projects.join("") != "" && instance.projects.some(i => text.toUpperCase().includes(i)))
	
				if(result.length == 0){
					chrome.search.query({text});
					return
				}else{
					url = `${result[0].content.endsWith('/') ? result[0].content.slice(0, -1) : result[0].content}/projects/${text.toUpperCase()}`;
				}
	
			}else if(instances.some(e => e.description == keywords[0].toUpperCase())){
				for(const instance of instances){
					if(keywords[0].toUpperCase() == instance.description){

						if(keywords[1] === undefined){

							url = instance.content;

						}else{

							switch (keywords[1].toUpperCase()) {
								case "JQL":
									text = text.replace(keywords[1], "").trim();
									url = `${instance.content.endsWith('/') ? instance.content.slice(0, -1) :instance.content}/secure/IssueNavigator!executeAdvanced.jspa?jqlQuery=${text.replaceAll(" ", "%20")}`
									break;
							
								default:
									url = `${instance.content.endsWith('/') ? instance.content.slice(0, -1) : instance.content}/secure/QuickSearch.jspa?searchString=${text.replaceAll(" ", "%20")}`
									break;
							}
						}
					}
				}
			}else{
				chrome.search.query({text: input});
				return
			}
		}

		chrome.tabs.update({url}, () => console.log(`Redirected to: ${url}`));

	}
	
});

chrome.commands.onCommand.addListener( async (command) => {

	let shortcuts = (await getLocalStorageValue('Shortcuts')).Shortcuts;
	shortcuts = shortcuts === undefined ? false : shortcuts;

	if( !shortcuts ){ return }

	const {
		Primary_Instance,
		Secondary_Instance,
		Primary_Link,
		Secondary_Link
	} = shortcuts

	switch (command) {
		case "create-new-jira":

			const defaultJira = Primary_Instance.content === undefined ? "" : Primary_Instance.content;

			if( defaultJira == "" ){ return }

			chrome.tabs.create({ url: `${defaultJira}/secure/CreateIssue!default.jspa` });

			break;
	
		case "create-secondary-new-jira":

			const secondaryJira = Secondary_Instance.content === undefined ? "" : Secondary_Instance.content;

			if( secondaryJira == "" ){ return }

			chrome.tabs.create({ url: `${secondaryJira}/secure/CreateIssue!default.jspa` });

			break;

		case "open-fav":

			if(Primary_Link === undefined || Primary_Link === ""){ return }

			chrome.tabs.create({ url: Primary_Link });

			break;

		case "open-secondary-fav":

			if(Secondary_Link === undefined || Secondary_Link === ""){ return }

			chrome.tabs.create({ url: Secondary_Link });

			break;
	}

})

chrome.history.onVisited.addListener( async ({url, title}) => {

	if(url.match(/^https:\/\/(.*?)\/jira\/projects/g) || url.match(/^https:\/\/(.*?)\/jira\/browse/g)){
		
		const visited = {
			title : title != "" ? title : "No Title",
			url : url
		}

		let JiraVisited = (await getLocalStorageValue('JiraVisited')).JiraVisited;

		if(JiraVisited !== undefined){

			const foundIndex = JiraVisited.findIndex(e => e.url == url);

			switch (JiraVisited.length) {
				case 10:

					if(foundIndex != -1){

						if(JiraVisited[foundIndex].title == "No Title" && title != ""){
							JiraVisited[foundIndex].title = title;
						}

						break;

					}else{
						JiraVisited.shift();
						JiraVisited.push(visited)
					}
					break;
			
				default:

					if(foundIndex != -1){

						if(JiraVisited[foundIndex].title == "No Title" && title != ""){
							JiraVisited[foundIndex].title = title;
						}

						break;

					}else{
						JiraVisited.push(visited)
					}

					break;
			}

			chrome.storage.sync.set({JiraVisited : JiraVisited});

		}else{

			chrome.storage.sync.set({JiraVisited : [visited]});

		}
	}

} )

const NodeHelper = require("node_helper");
const { Client } = require("@notionhq/client");

module.exports = NodeHelper.create({
	start: function() {
		console.log(this.name + " is started!");
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === "GET_DATA") {

			(async () => {
				const notion = new Client({ auth: payload.NOTION_API_KEY });

				const dataSourceId = payload.NOTION_DATA_SOURCE;
				const response = await notion.dataSources.query({
					data_source_id: dataSourceId,
					filter: {
						// Only get the elements that are unchecked
						property: 'Done',
						checkbox: {
							equals: false,
						},
					},
				});

				// Extract important data from the response.results
				let entries = response.results.map((el) => {
					return {
						title: el.properties['Task'].title.map((el) => el.plain_text),
						deadline: el.properties['Due Date'].date?.start,
					};
				});

				this.sendSocketNotification("DATA_RESULT", entries);
			})();

		}
	},
});

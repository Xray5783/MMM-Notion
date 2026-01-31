Module.register("MMM-Notion", {
	getDom: function () {
		const wrapper = document.createElement("div");
		wrapper.id = "tableContainer";
		wrapper.innerHTML = this.config.text;
		return wrapper;
	},

	start: function () {
		this.config.text = "Loading ...";

		this.sendSocketNotification("GET_DATA", {
			NOTION_API_KEY: this.config.NOTION_API_KEY,
			NOTION_PAGE_ID: this.config.NOTION_PAGE_ID,
			NOTION_DATA_SOURCE: this.config.NOTION_DATA_SOURCE,
		});

		setInterval(() => {
			this.sendSocketNotification("GET_DATA", {
				NOTION_API_KEY: this.config.NOTION_API_KEY,
				NOTION_PAGE_ID: this.config.NOTION_PAGE_ID,
				NOTION_DATA_SOURCE: this.config.NOTION_DATA_SOURCE,
			});
		}, 30000);
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "DATA_RESULT") {

			const tableHTML = `
			  <table border="1" cellpadding="6" cellspacing="0">
				<thead>
				  <tr>
					<th>Title</th>
					<th>Deadline</th>
				  </tr>
				</thead>
				<tbody>
				  ${payload.map(item => `
					<tr>
					  <td>${item.title?.[0] || '—'}</td>
					  <td>${item.deadline || '—'}</td>
					</tr>
				  `).join('')}
				</tbody>
			  </table>`;

			this.config.text = tableHTML;
			this.updateDom();
		}
	},
});

Module.register("MMM-Notion", {
	defaults: {
		text: "Das ist ein test",
	},

	getDom: function () {
		const wrapper = document.createElement("div");
		wrapper.innerHTML = this.config.text;
		return wrapper;
	},
});

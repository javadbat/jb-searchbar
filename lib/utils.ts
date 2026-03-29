export function createFilterDOM(label: string, columnLabel: string, filterIndex: number, deleteFilter: (index: number) => void) {
  const dom = document.createElement("div");
  dom.classList.add("filter-item");
  const deleteButtonDom = document.createElement("div");
  deleteButtonDom.classList.add("delete-btn");
  deleteButtonDom.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 298.667 298.667" style="enable-background:new 0 0 298.667 298.667;" xml:space="preserve"><g><polygon points="298.667,30.187 268.48,0 149.333,119.147 30.187,0 0,30.187 119.147,149.333 0,268.48 30.187,298.667     149.333,179.52 268.48,298.667 298.667,268.48 179.52,149.333   "/></g></svg>`;
  const labelDom = document.createElement("div");
  labelDom.classList.add("filter-label");
  labelDom.innerHTML = `${columnLabel}: ${label}`;
  // const filterIndex = this.filterList.length;
  dom.dataset.filterIndex = filterIndex.toString();
  deleteButtonDom.addEventListener("click", (e) => {
    const currentTarget = e.currentTarget as HTMLDivElement;
    const filterIndex = parseInt(
      currentTarget!.parentElement!.dataset.filterIndex!, 10
    );
    deleteFilter(filterIndex);
  });
  dom.appendChild(deleteButtonDom);
  dom.appendChild(labelDom);
  return dom;
}
/**
 * @author Jörn Kreutel
 */
import { GenericCRUDImplLocal, mwf } from "vfh-iam-mwf-base";
import { mwfUtils } from "vfh-iam-mwf-base";
import * as entities from "../model/MyEntities.js";

export default class ListviewViewController extends mwf.ViewController {

    // instance attributes set by mwf after instantiation
    args;
    root;
    // TODO-REPEATED: declare custom instance attributes for this controller

    constructor() {
        super();

        this.items = [
            new entities.MediaItem("Item 1", "https://picsum.photos/100/100"),
            new entities.MediaItem("Item 2", "https://picsum.photos/200/100"),
            new entities.MediaItem("Item 3", "https://picsum.photos/300/100"),
            new entities.MediaItem("Item 4", "https://picsum.photos/400/100"),
            new entities.MediaItem("Item 5", "https://picsum.photos/500/100")
        ];

        this.crudops = GenericCRUDImplLocal.newInstance("MediaItem");

        console.log("ListviewViewController()");
    }

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        // TODO: do databinding, set listeners, initialise the view
        const addNewElementAction = this.root.querySelector("header .mwf-img-plus")
        addNewElementAction.onclick = () => {
            const newMediaItem = this.createRandomMediaItem();
            this.crudops.create(newMediaItem).then(created => this.addToListview(created));
        }

        this.crudops.readAll().then(items => this.initialiseListview(items));

        // call the superclass once creation is done
        super.oncreate();
    }

    /*
     * for views that initiate transitions to other views
     * NOTE: return false if the view shall not be returned to, e.g. because we immediately want to display its previous view. Otherwise, do not return anything.
     */
    async onReturnFromNextView(nextviewid, returnValue, returnStatus) {
        // TODO: check from which view, and possibly with which status, we are returning, and handle returnValue accordingly
    }

    /*
     * for views with listviews: bind a list item to an item view
     * TODO: delete if no listview is used or if databinding uses ractive templates
     */
    bindListItemView(listviewid, itemview, itemobj) {
        console.log("bindListItemView(): ", itemview, itemobj);
        // TODO: implement how attributes of itemobj shall be displayed in itemview
        // imperatives data binding
        itemview.root.querySelector("img").src = itemobj.src;
        itemview.root.querySelector("h2").textContent = itemobj.title;
        itemview.root.getElementsByTagName("h3")[0].textContent = itemobj.added;
    }

    /*
     * for views with listviews: react to the selection of a listitem
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemSelected(itemobj, listviewid) {
        // TODO: implement how selection of itemobj shall be handled
        alert("Selected item: " + itemobj.title);
    }

    /*
     * for views with listviews: react to the selection of a listitem menu option
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemMenuItemSelected(menuitemview, itemobj, listview) {
        // TODO: implement how selection of the option menuitemview for itemobj shall be handled
    }

    /*
     * for views with dialogs
     * TODO: delete if no dialogs are used or if generic controller for dialogs is employed
     */
    bindDialog(dialogid, dialogview, dialogdataobj) {
        // call the supertype function
        super.bindDialog(dialogid, dialogview, dialogdataobj);

        // TODO: implement action bindings for dialog, accessing dialog.root
    }

    // generate random list items on clicking the add button
    async createRandomMediaItem() {
        const allItems = await this.crudops.readAll();
        const randomWidth = 100 + Math.floor(Math.random() * 500);
        const title = "Item " + (allItems.length + 1);
        const src = "https://picsum.photos/" + randomWidth + "/100";
        return new entities.MediaItem(title, src);
    }
}


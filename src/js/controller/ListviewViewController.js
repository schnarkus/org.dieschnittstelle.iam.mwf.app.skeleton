/**
 * @author Jörn Kreutel
 */
import { mwf } from "vfh-iam-mwf-base";
import * as entities from "../model/MyEntities.js";
import { EventMatcher } from "vfh-iam-mwf-base/src/js/mwf/mwf.js";

export default class ListviewViewController extends mwf.ViewController {

    // instance attributes set by mwf after instantiation
    args;
    root;
    // TODO-REPEATED: declare custom instance attributes for this controller

    constructor() {
        super();

        console.log("ListviewViewController()");
    }

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        // TODO: do databinding, set listeners, initialise the view

        // Dieser Controller verhält sich als Subscriber der mwf-Eventinfrastruktur.
        //
        // - Event Channel: die zentrale Event-Infrastruktur des mwf-Frameworks
        //   (wir registrieren Listener mit this.addListener()).
        // - Publisher: Komponenten wie das Entity-/CRUD-Modul (EntityManager)
        //   veröffentlichen (publish) Events, sobald sich Daten ändern.
        //   Typische Auslöser sind Aufrufe an Entity-Methoden wie
        //   item.create(), item.update(), item.delete()
        //   Diese Methoden rufen intern die mwf-API auf, die dann ein Event
        //   mit Kategorie "crud" und der passenden Aktion ("created","updated","deleted")
        //   publiziert.
        // - Event-Matcher: Zur Beschreibung, welche Events ein Listener empfängt,
        //   verwenden wir ein EventMatcher-Objekt (Kategorie, Aktion, Entity-Typ),
        //   z.B. new EventMatcher("crud", "deleted", "MediaItem").
        // - Event-Objekt: Sobald ein passendes Event eintrifft, wird der Callback
        //   aufgerufen und erhält ein Eventobjekt. Die Nutzdaten (z.B. das
        //   betroffene Entity) sind in evt.data enthalten. Im Callback
        //   aktualisieren wir die Listview (z.B. add/remove/update) anhand dieser Daten.
        //
        // Vorteil: Publisher und Subscriber sind entkoppelt; der Controller
        // muss nicht wissen, wer die Änderungen verursacht hat.
        this.addListener(new EventMatcher("crud", "deleted", "MediaItem"), evt => {
            console.log("Received delete event: ", evt);
            this.removeFromListview(evt.data);
        });

        this.addListener(new EventMatcher("crud", "created", "MediaItem"), evt => {
            console.log("Received create event: ", evt);
            this.addToListview(evt.data);
        });

        this.addListener(new EventMatcher("crud", "updated", "MediaItem"), evt => {
            console.log("Received update event: ", evt);
            this.updateInListview(evt.data._id, evt.data);
        });

        const addNewElementAction = this.root.querySelector("#addMediaButton");
        if (addNewElementAction) {
            addNewElementAction.onclick = async () => {
                await this.createNewItem();
            };
        } else {
            console.warn("ListviewViewController: add-new element not found (addMediaButton)");
        }

        entities.MediaItem.readAll().then(items => this.initialiseListview(items));

        // call the superclass once creation is done
        super.oncreate();
    }

    /*
     * for views that initiate transitions to other views
     * NOTE: return false if the view shall not be returned to, e.g. because we immediately want to display its previous view. Otherwise, do not return anything.
     */
    // async onReturnFromNextView(nextviewid, returnValue, returnStatus) {
    //     console.log("onReturnFromNextView(): ", nextviewid, returnValue, returnStatus);
    //     // TODO: check from which view, and possibly with which status, we are returning, and handle returnValue accordingly
    //     if (returnStatus === "itemDeleted" && returnValue.item) {
    //         console.log("onReturnFromNextView(): Deleting item from listview: ", returnValue.item);
    //         this.removeFromListview(returnValue.item._id);
    //     }
    // }

    /*
     * for views with listviews: bind a list item to an item view
     * TODO: delete if no listview is used or if databinding uses ractive templates
     */
    // bindListItemView(listviewid, itemview, itemobj) {
    //     console.log("bindListItemView(): ", itemview, itemobj);
    // TODO: implement how attributes of itemobj shall be displayed in itemview
    // imperatives data binding
    // itemview.root.querySelector("img").src = itemobj.src;
    // itemview.root.querySelector("h2").textContent = itemobj.title;
    // itemview.root.getElementsByTagName("h3")[0].textContent = itemobj.added;
    // }

    /*
     * for views with listviews: react to the selection of a listitem
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemSelected(itemobj, listviewid) {
        // TODO: implement how selection of itemobj shall be handled
        // alert("Selected item: " + itemobj.title);
        this.nextView("myapp-mediaReadview", { item: itemobj });
    }

    /*
     * for views with listviews: react to the selection of a listitem menu option
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    // onListItemMenuItemSelected(menuitemview, itemobj, listview) {
    // TODO: implement how selection of the option menuitemview for itemobj shall be handled
    //     console.log("onListItemMenuItemSelected(): ", menuitemview, itemobj);
    // }

    /*
     * for views with dialogs
     * TODO: delete if no dialogs are used or if generic controller for dialogs is employed
     */
    bindDialog(dialogid, dialogview, dialogdataobj) {
        // call the supertype function
        super.bindDialog(dialogid, dialogview, dialogdataobj);

        // TODO: implement action bindings for dialog, accessing dialog.root
    }

    // generate a new item and show the dialog to create it
    async createNewItem() {
        const resp = await fetch("https://picsum.photos/1000/1000");
        const newItem = new entities.MediaItem("", resp.url);
        // Dialog öffnen; submit führt create aus, delete schließt den Dialog
        this.showDialog("mediaItemDialog", {
            item: newItem,
            actionBindings: {
                submitForm: async e => { e.original.preventDefault(); await newItem.create(); this.hideDialog(); },
                deleteItem: () => this.hideDialog()
            }
        });
        return newItem;
    }

    // lifecycle method called when the view is shown
    // async onresume() {
    //     entities.MediaItem.readAll().then(items => this.initialiseListview(items));
    //     return super.onresume();
    // }

    editItem(item) {
        this.showDialog("mediaItemDialog", {
            item: item,
            actionBindings: {
                submitForm: async e => { e.original.preventDefault(); await item.update(); this.hideDialog(); },
                deleteItem: async () => { await this.deleteItem(item); this.hideDialog(); }
            }
        });
    }

    deleteItem(item) {
        return item.delete();
    }
}

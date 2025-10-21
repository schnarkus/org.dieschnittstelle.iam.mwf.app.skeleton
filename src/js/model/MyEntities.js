/**
 * @author Jörn Kreutel
 *
 * this skript defines the data types used by the application and the model operations for handling instances of the latter
 */

import { mwfUtils } from "vfh-iam-mwf-base";
import { EntityManager } from "vfh-iam-mwf-base";

/*************
 * example entity
 *************/

export class MyEntity extends EntityManager.Entity {

    // TODO-REPEATED: declare entity instance attributes

    constructor() {
        super();
    }

}

// TODO-REPEATED: add new entity class declarations here
// Verwalter von State, Source of Truth
export class MediaItem extends EntityManager.Entity {

    constructor(title, source, contentType) {
        super();

        this.title = title;
        this.src = source;
        this.contentType = contentType;
        this.added = Date.now();
    }

}
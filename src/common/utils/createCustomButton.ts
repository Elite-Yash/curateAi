function createCustomButton(label: any, imgSrc: any, altText: any) {

    const customeSpan = document.createElement("span");
    customeSpan.setAttribute("style", "display: inline-flex; align-items: center; margin-left: 3px; cursor: pointer; position: relative; top: 7px; background: #ff5c35; border-radius: 50px; padding: 1px;margin-bottom: 10px;");

    // Create contents span
    const contentsSpan = document.createElement("span");
    contentsSpan.setAttribute("class", "contents");
    contentsSpan.setAttribute("style", "border-radius: 50px; padding: 3px 8px 2px 1px; display: flex; align-items: center;");

    // Create image span
    const imgSpan = document.createElement("span");
    const imgElement = document.createElement("img");
    imgElement.src = imgSrc;
    imgElement.alt = altText;
    imgSpan.setAttribute("style", "width: 25px; display: inline-flex; height: 25px; overflow: hidden; border-radius: 100%; margin-left: 3px; border: 1.5px solid #fff; padding: 3px; cursor: pointer;");
    imgSpan.appendChild(imgElement);

    // Create text span
    const textSpan = document.createElement("span");
    textSpan.innerText = label; // Use the passed label
    textSpan.setAttribute("style", "margin-left: 5px; font-size: 15px; color: #fff;");

    // Append image and text spans to contents span
    contentsSpan.appendChild(imgSpan);
    contentsSpan.appendChild(textSpan);

    // Append contents span to main span
    customeSpan.appendChild(contentsSpan);

    return customeSpan; // Return the created button
}

export { createCustomButton };

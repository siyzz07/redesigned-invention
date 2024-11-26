const { on } = require("nodemon");
const Category = require("../model/categoryModel");






// -------- load category page -------
const categoryGet = async (req, res) => {
  try {
    const userid = req.session.user._id;
    const msg = req.flash("msg");
    const message = req.flash("message");

    const categories = await Category.findOne({ userId: userid });

    const categoryItems = categories ? categories.categoryItems : [];

    res.render("categories", {
      msg,
      message,
      categoryItems,
    });
  } catch (error) {
    console.log(error.message);
    req.flash("error", "An error occurred while fetching categories!");
    return res.redirect("/category");
  }
};



// 
const categoryAddPost = async (req, res) => {
  try {
    const userId = req.session.user._id;
   
    
    const { category, description, setlimit,expiretime } = req.body;
    const categery = category.toLowerCase();

    const existingCategory = await Category.findOne({
      userId: userId,
      "categoryItems.name": categery,
    });

    if (existingCategory) {
      req.flash("message", "categoryExist");
      return res.redirect("/category");
    } else {
      const newCategory = await Category.findOne({ userId: userId });

      if (newCategory) {
        newCategory.categoryItems.push({
          name: categery,
          description: description,
          limit: setlimit,
          createdat: Date.now(),
          expireTime:expiretime
        });

        await newCategory.save();
        req.flash("message", "success");
        return res.redirect("/category");
      } else {
        const newCategory = new Category({
          userId: userId,
          categoryItems: [
            {
              name: categery,
              description: description,
              limit: setlimit,
              createdat: Date.now(),
              expireTime:expiretime
            },
          ],
        });

        await newCategory.save();
        req.flash("message", "success");
        return res.redirect("/category");
      }
    }
  } catch (error) {
    console.log("Error:", error.message);
    req.flash("error", "An error occurred while adding the category!");
    return res.redirect("/category");
  }
};

module.exports = {
  categoryGet,
  categoryAddPost,
};

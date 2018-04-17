const app = require('../app')
const EventProposal = require("../models/event_proposal");
const Chef = require("../models/chef");

const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");

exports.list_get = function (req, res, next) {
    Chef.findById(app.locals._user.chef_id)
        .populate("event_proposals")
        .exec(function (err, chef) {
            res.render("event_proposal_list", { event_proposals: chef.event_proposals })
        })
}

exports.detail_get = function (req, res, next) {
    EventProposal.findById(req.params.id)
        .populate("dishes appetizers")
        .exec(function (err, event_proposal) {
            if (err) return next(err);
            if (event_proposal == null) {
                var err = new Error("No se encontró propuesta de evento.")
                err.status = 400;
                return next(err);
            }
            res.render("event_proposal_detail", { event_proposal: event_proposal })
        })
}